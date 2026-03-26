import DatabaseService from "./Database";
import AnalyticsTracker from "./AnalyticsTracker";

export interface ConversionGoal {
  id?: number;
  link_id: number;
  name: string;
  type: 'click' | 'signup' | 'purchase' | 'custom';
  value?: number;
  pixel_id?: string;
  is_active: boolean;
  created_at?: number;
}

export interface ConversionEvent {
  id?: number;
  link_id: number;
  goal_id: number;
  ab_test_name?: string;
  ab_test_variant?: string;
  value?: number;
  metadata?: any;
  created_at?: number;
}

export interface FunnelStep {
  id?: number;
  link_id: number;
  name: string;
  order_index: number;
  url_pattern?: string;
  event_type?: string;
  is_active: boolean;
}

export interface FunnelAnalytics {
  total_users: number;
  step_conversion: Array<{
    step_name: string;
    users: number;
    conversion_rate: number;
    drop_off_rate: number;
  }>;
  total_conversion_rate: number;
  average_time_to_convert?: number;
}

export default class ConversionTracker {
  private static instance: ConversionTracker;
  private db: DatabaseService;
  private analytics: AnalyticsTracker;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.analytics = AnalyticsTracker.getInstance();
  }

  public static getInstance(): ConversionTracker {
    if (!ConversionTracker.instance) {
      ConversionTracker.instance = new ConversionTracker();
    }
    return ConversionTracker.instance;
  }

  /**
   * Track A/B test participation for consistent assignment
   */
  public async trackABTestParticipation(
    linkId: number,
    testName: string,
    variantName: string
  ): Promise<void> {
    // Store in session or use persistent storage for consistent assignment
    const sessionId = this.generateSessionId();
    
    await this.db.table('ab_test_participants').insert({
      link_id: linkId,
      test_name: testName,
      variant_name: variantName,
      session_id: sessionId,
      participated_at: Date.now()
    }).onConflict(['link_id', 'test_name', 'session_id'])
      .merge({
        variant_name: variantName,
        participated_at: Date.now()
      });
  }

  /**
   * Track conversion event
   */
  public async trackConversion(
    linkId: number,
    goalName: string,
    value?: number,
    metadata?: any
  ): Promise<void> {
    const goal = await this.db.table('conversion_goals')
      .where({ link_id: linkId, name: goalName, is_active: true })
      .first();

    if (!goal) {
      // Create goal if it doesn't exist
      const [goalId] = await this.db.table('conversion_goals').insert({
        link_id: linkId,
        name: goalName,
        type: 'custom',
        value: value,
        is_active: true,
        created_at: Date.now()
      });
      goal.id = goalId;
    }

    // Get A/B test variant if participant
    const sessionId = this.generateSessionId();
    const abTestParticipant = await this.db.table('ab_test_participants')
      .where({ link_id: linkId, session_id: sessionId })
      .first();

    // Record conversion event
    await this.db.table('conversion_events').insert({
      link_id: linkId,
      goal_id: goal.id,
      ab_test_name: abTestParticipant?.test_name,
      ab_test_variant: abTestParticipant?.variant_name,
      value: value || goal.value,
      metadata: JSON.stringify(metadata || {}),
      created_at: Date.now()
    });

    // Track analytics
    await this.analytics.trackConversion(linkId, {
      goal: goalName,
      value: value || goal.value,
      variant: abTestParticipant?.variant_name
    });
  }

  /**
   * Create conversion goal
   */
  public async createGoal(goal: ConversionGoal): Promise<number> {
    const [id] = await this.db.table('conversion_goals').insert({
      ...goal,
      created_at: Date.now()
    });
    return id;
  }

  /**
   * Get conversion analytics for a link
   */
  public async getConversionAnalytics(
    linkId: number,
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<any> {
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    }[period];

    const startTime = Date.now() - periodMs;

    // Get conversion events
    const events = await this.db.table('conversion_events')
      .where({ link_id: linkId })
      .where('created_at', '>=', startTime)
      .orderBy('created_at', 'desc');

    // Get goals
    const goals = await this.db.table('conversion_goals')
      .where({ link_id: linkId, is_active: true });

    // Calculate analytics
    const analytics = {
      total_conversions: events.length,
      total_value: events.reduce((sum, event) => sum + (event.value || 0), 0),
      conversion_rate: 0,
      goals_performance: goals.map(goal => ({
        goal_name: goal.name,
        conversions: events.filter(e => e.goal_id === goal.id).length,
        total_value: events.filter(e => e.goal_id === goal.id)
          .reduce((sum, e) => sum + (e.value || 0), 0)
      })),
      ab_test_results: await this.getABTestResults(linkId, startTime)
    };

    // Calculate conversion rate based on clicks
    const clicks = await this.db.table('analytics')
      .where({ link_id: linkId, event_type: 'click' })
      .where('created_at', '>=', startTime)
      .count('* as count')
      .first();

    if (clicks && clicks.count > 0) {
      analytics.conversion_rate = (events.length / clicks.count) * 100;
    }

    return analytics;
  }

  /**
   * Get A/B test results
   */
  private async getABTestResults(
    linkId: number,
    startTime: number
  ): Promise<any> {
    const participants = await this.db.table('ab_test_participants')
      .where({ link_id: linkId })
      .where('participated_at', '>=', startTime);

    const conversions = await this.db.table('conversion_events')
      .where({ link_id: linkId })
      .where('created_at', '>=', startTime)
      .whereNotNull('ab_test_name');

    const results = {};

    // Group by test and variant
    participants.forEach(participant => {
      const key = `${participant.test_name}:${participant.variant_name}`;
      if (!results[key]) {
        results[key] = {
          test_name: participant.test_name,
          variant_name: participant.variant_name,
          participants: 0,
          conversions: 0,
          conversion_rate: 0
        };
      }
      results[key].participants++;
    });

    conversions.forEach(conversion => {
      const key = `${conversion.ab_test_name}:${conversion.ab_test_variant}`;
      if (results[key]) {
        results[key].conversions++;
      }
    });

    // Calculate conversion rates
    Object.values(results).forEach((result: any) => {
      if (result.participants > 0) {
        result.conversion_rate = (result.conversions / result.participants) * 100;
      }
    });

    return Object.values(results);
  }

  /**
   * Create funnel steps
   */
  public async createFunnelSteps(
    linkId: number,
    steps: Array<{ name: string; url_pattern?: string; event_type?: string }>
  ): Promise<void> {
    await this.db.table('funnel_steps').where({ link_id: linkId }).delete();

    for (let i = 0; i < steps.length; i++) {
      await this.db.table('funnel_steps').insert({
        link_id: linkId,
        name: steps[i].name,
        order_index: i,
        url_pattern: steps[i].url_pattern,
        event_type: steps[i].event_type,
        is_active: true
      });
    }
  }

  /**
   * Get funnel analytics
   */
  public async getFunnelAnalytics(linkId: number): Promise<FunnelAnalytics> {
    const steps = await this.db.table('funnel_steps')
      .where({ link_id: linkId, is_active: true })
      .orderBy('order_index', 'asc');

    const stepAnalytics = [];
    let totalUsers = 0;

    for (const step of steps) {
      const users = await this.getStepUsers(linkId, step);
      
      if (step.order_index === 0) {
        totalUsers = users;
      }

      const conversionRate = totalUsers > 0 ? (users / totalUsers) * 100 : 0;
      const previousUsers = stepAnalytics.length > 0 ? stepAnalytics[stepAnalytics.length - 1].users : users;
      const dropOffRate = previousUsers > 0 ? ((previousUsers - users) / previousUsers) * 100 : 0;

      stepAnalytics.push({
        step_name: step.name,
        users,
        conversion_rate: conversionRate,
        drop_off_rate: dropOffRate
      });
    }

    const totalConversionRate = totalUsers > 0 ? (stepAnalytics[stepAnalytics.length - 1]?.conversion_rate || 0) : 0;

    return {
      total_users: totalUsers,
      step_conversion: stepAnalytics,
      total_conversion_rate: totalConversionRate
    };
  }

  private async getStepUsers(linkId: number, step: any): Promise<number> {
    if (step.event_type) {
      const result = await this.db.table('conversion_events')
        .where({ link_id: linkId })
        .where('metadata', 'like', `%"step":"${step.name}"%`)
        .count('* as count')
        .first();
      return result?.count || 0;
    }

    if (step.url_pattern) {
      const result = await this.db.table('analytics')
        .where({ link_id: linkId, event_type: 'page_view' })
        .where('metadata', 'like', `%"url":"${step.url_pattern}"%`)
        .countDistinct('ip_address as count')
        .first();
      return result?.count || 0;
    }

    return 0;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}