import DatabaseService from "./Database";
import AnalyticsTracker from "./AnalyticsTracker";
import ConversionTracker from "./ConversionTracker";
import PerformanceScorer from "./PerformanceScorer";

export interface RoutingRule {
  id?: number;
  link_id: number;
  rule_type: 'time' | 'location' | 'device' | 'language' | 'ab_test';
  condition: any;
  target_url: string;
  weight?: number;
  priority: number;
  is_active: boolean;
  created_at?: number;
  updated_at?: number;
}

export interface RoutingContext {
  ip: string;
  userAgent: string;
  language: string;
  timestamp: number;
  country?: string;
  city?: string;
  device?: 'mobile' | 'desktop' | 'tablet';
  browser?: string;
  os?: string;
}

export interface ABTestVariant {
  url: string;
  weight: number;
  name: string;
  conversions?: number;
  clicks?: number;
}

export default class DynamicRouter {
  private static instance: DynamicRouter;
  private db: DatabaseService;
  private analytics: AnalyticsTracker;
  private conversionTracker: ConversionTracker;
  private performanceScorer: PerformanceScorer;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.analytics = AnalyticsTracker.getInstance();
    this.conversionTracker = ConversionTracker.getInstance();
    this.performanceScorer = PerformanceScorer.getInstance();
  }

  public static getInstance(): DynamicRouter {
    if (!DynamicRouter.instance) {
      DynamicRouter.instance = new DynamicRouter();
    }
    return DynamicRouter.instance;
  }
  
  /**
   * Route user to appropriate URL based on dynamic rules
   */
  public async route(
    alias: string,
    context: RoutingContext
  ): Promise<string | null> {
    const link = await this.db.from('links').where({ alias }).first();
    if (!link) return null;

    // Check if link is expired
    if (link.expires_at && Date.now() > link.expires_at) {
      return null;
    }

    // Get all active routing rules for this link
    const rules = await this.db.from('routing_rules')
      .where({ link_id: link.id, is_active: true })
      .orderBy('priority', 'desc');

    // Separate A/B test rules from other rules
    const abTestRules = rules.filter(rule => rule.rule_type === 'ab_test');
    const regularRules = rules.filter(rule => rule.rule_type !== 'ab_test');

    // Check regular rules first
    for (const rule of regularRules) {
      if (this.matchesRule(rule, context)) {
        return await this.executeRouting(link, rule, context);
      }
    }

    // If no regular rules match, try A/B testing
    if (abTestRules.length > 0) {
      const selectedRule = await this.getABTestVariant(link.id, abTestRules, context);
      if (selectedRule) {
        return await this.executeRouting(link, selectedRule, context);
      }
    }

    // No matching rule, use default URL
    await this.logRouting(link.id, null, context);
    return link.url;
  }

  private async executeRouting(
    link: any,
    rule: any,
    context: RoutingContext
  ): Promise<string> {
    // Log the routing decision
    await this.logRouting(link.id, rule.id, context);
    
    // Track analytics
    await this.analytics.trackClick(link.id, {
      ip: context.ip,
      userAgent: context.userAgent,
      referrer: context.referrer,
      country: context.country,
      device: context.device
    });

    // Track A/B test participation if applicable
    if (rule.rule_type === 'ab_test') {
      await this.conversionTracker.trackABTestParticipation(
        link.id,
        rule.condition.test_name,
        rule.condition.variant_name
      );
    }

    return rule.target_url;
  }

  /**
   * Get A/B test variant based on weighted random selection
   */
  public async getABTestVariant(linkId: number, testName: string, variants: ABTestVariant[]): Promise<ABTestVariant> {
    // Get user assignment from cookie/session or create new
    const assignmentKey = `ab_test_${linkId}_${testName}`;
    let assignedVariant = this.getStoredAssignment(assignmentKey);
    
    if (!assignedVariant) {
      // New assignment based on weights
      assignedVariant = this.weightedRandomSelect(variants);
      this.storeAssignment(assignmentKey, assignedVariant.name);
    }
    
    return variants.find(v => v.name === assignedVariant) || variants[0];
  }

  /**
   * Track conversion for A/B test
   */
  public async trackConversion(linkId: number, testName: string, variantName: string): Promise<void> {
    await DB.table('ab_test_conversions').insert({
      link_id: linkId,
      test_name: testName,
      variant_name: variantName,
      converted_at: Date.now()
    });
  }

  /**
   * Check if routing rule matches current context
   */
  private async matchesRule(rule: RoutingRule, context: RoutingContext): Promise<boolean> {
    switch (rule.rule_type) {
      case 'time':
        return this.matchesTimeRule(rule.condition, context.timestamp);
      case 'location':
        return await this.matchesLocationRule(rule.condition, context);
      case 'device':
        return this.matchesDeviceRule(rule.condition, context);
      case 'language':
        return this.matchesLanguageRule(rule.condition, context);
      case 'ab_test':
        return await this.matchesABTestRule(rule, context);
      default:
        return false;
    }
  }

  /**
   * Time-based rule matching
   */
  private matchesTimeRule(condition: any, timestamp: number): boolean {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const day = date.getDay();
    
    if (condition.hours && !condition.hours.includes(hour)) {
      return false;
    }
    
    if (condition.days && !condition.days.includes(day)) {
      return false;
    }
    
    if (condition.date_range) {
      const start = new Date(condition.date_range.start).getTime();
      const end = new Date(condition.date_range.end).getTime();
      if (timestamp < start || timestamp > end) {
        return false;
      }
    }
    
    return true;
  }

  private async getABTestVariant(
    linkId: number,
    rules: any[],
    context: RoutingContext
  ): Promise<any | null> {
    // Use consistent hashing based on IP + User Agent for sticky assignment
    const hash = this.hashContext(context);
    const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0);
    const randomValue = (hash % totalWeight) + 1;
    
    let cumulativeWeight = 0;
    for (const rule of rules) {
      cumulativeWeight += rule.weight;
      if (randomValue <= cumulativeWeight) {
        return rule;
      }
    }
    
    return rules[0]; // Fallback to first rule
  }

  private hashContext(context: RoutingContext): number {
    const str = `${context.ip}:${context.userAgent}:${context.referrer || ''}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async logRouting(
    linkId: number,
    ruleId: number | null,
    context: RoutingContext
  ): Promise<void> {
    await this.db.table('routing_logs').insert({
      link_id: linkId,
      rule_id: ruleId,
      ip_address: context.ip,
      user_agent: context.userAgent,
      country: context.country,
      device: context.device,
      routed_at: Date.now()
    });
  }

  /**
   * Location-based rule matching
   */
  private async matchesLocationRule(condition: any, context: RoutingContext): Promise<boolean> {
    // Get location from IP if not provided
    if (!context.country && context.ip) {
      const location = await this.getLocationFromIP(context.ip);
      context.country = location.country;
      context.city = location.city;
    }
    
    if (condition.countries && !condition.countries.includes(context.country)) {
      return false;
    }
    
    if (condition.cities && !condition.cities.includes(context.city)) {
      return false;
    }
    
    if (condition.exclude_countries && condition.exclude_countries.includes(context.country)) {
      return false;
    }
    
    return true;
  }

  /**
   * Device-based rule matching
   */
  private matchesDeviceRule(condition: any, context: RoutingContext): boolean {
    // Parse device type if not provided
    if (!context.device) {
      context.device = this.parseDeviceType(context.userAgent);
    }
    
    if (condition.devices && !condition.devices.includes(context.device)) {
      return false;
    }
    
    if (condition.browsers && !condition.browsers.includes(context.browser || '')) {
      return false;
    }
    
    if (condition.operating_systems && !condition.operating_systems.includes(context.os || '')) {
      return false;
    }
    
    return true;
  }

  /**
   * Language-based rule matching
   */
  private matchesLanguageRule(condition: any, context: RoutingContext): boolean {
    const userLang = context.language.toLowerCase().split('-')[0];
    
    if (condition.languages && !condition.languages.includes(userLang)) {
      return false;
    }
    
    if (condition.exclude_languages && condition.exclude_languages.includes(userLang)) {
      return false;
    }
    
    return true;
  }

  /**
   * A/B Test rule matching
   */
  private async matchesABTestRule(rule: RoutingRule, context: RoutingContext): Promise<boolean> {
    const testName = rule.condition.test_name;
    const variants: ABTestVariant[] = rule.condition.variants;
    
    const selectedVariant = await this.getABTestVariant(rule.link_id, testName, variants);
    
    return selectedVariant.url === rule.target_url;
  }

  /**
   * Get active routing rules for a link
   */
  private async getActiveRules(linkId: number): Promise<RoutingRule[]> {
    return await DB.table('routing_rules')
      .where({ link_id: linkId, is_active: true })
      .orderBy('priority', 'desc')
      .select();
  }

  /**
   * Get default URL for link (fallback)
   */
  private async getDefaultUrl(linkId: number): Promise<string> {
    const link = await DB.table('links').where({ id: linkId }).first();
    if (!link) throw new Error('Link not found');
    
    // Handle multiple URLs (rotation)
    const urls = JSON.parse(link.urls || '[]');
    if (urls.length === 0) throw new Error('No URLs configured');
    
    if (urls.length === 1) {
      return urls[0].url || urls[0];
    }
    
    // Simple rotation for now (can be enhanced)
    return urls[0].url || urls[0];
  }

  /**
   * Get location from IP address
   */
  private async getLocationFromIP(ip: string): Promise<{country: string, city: string}> {
    // Simple implementation - can be enhanced with external service
    // For now, return default or use a mock service
    return {
      country: 'US',
      city: 'Unknown'
    };
  }

  /**
   * Parse device type from user agent
   */
  private parseDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
    const ua = userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad/.test(ua)) {
      return /ipad|tablet/.test(ua) ? 'tablet' : 'mobile';
    }
    
    return 'desktop';
  }

  /**
   * Weighted random selection
   */
  private weightedRandomSelect(variants: ABTestVariant[]): ABTestVariant {
    const totalWeight = variants.reduce((sum, v) => sum + (v.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of variants) {
      random -= (variant.weight || 1);
      if (random <= 0) {
        return variant;
      }
    }
    
    return variants[0];
  }

  /**
   * Get stored A/B test assignment
   */
  private getStoredAssignment(key: string): string | null {
    // Implementation depends on session/cookie storage
    // For now, return null to force new assignment
    return null;
  }

  /**
   * Store A/B test assignment
   */
  private storeAssignment(key: string, variant: string): void {
    // Implementation depends on session/cookie storage
    // Can use localStorage, cookies, or server-side session
  }

  /**
   * Track routing decision for analytics
   */
  private async trackRouting(linkId: number, ruleId: number, context: RoutingContext): Promise<void> {
    await DB.table('routing_logs').insert({
      link_id: linkId,
      rule_id: ruleId,
      ip_address: context.ip,
      user_agent: context.userAgent,
      country: context.country,
      device: context.device,
      routed_at: Date.now()
    });
  }

  /**
   * Create new routing rule
   */
  public async createRule(rule: Omit<RoutingRule, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const now = Date.now();
    const [id] = await DB.table('routing_rules').insert({
      ...rule,
      created_at: now,
      updated_at: now
    });
    return id;
  }

  /**
   * Update routing rule
   */
  public async updateRule(id: number, updates: Partial<RoutingRule>): Promise<void> {
    await DB.table('routing_rules')
      .where({ id })
      .update({
        ...updates,
        updated_at: Date.now()
      });
  }

  /**
   * Delete routing rule
   */
  public async deleteRule(id: number): Promise<void> {
    await DB.table('routing_rules').where({ id }).delete();
  }

  /**
   * Get routing analytics
   */
  public async getRoutingAnalytics(linkId: number, days: number = 30): Promise<any> {
    const startTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const analytics = await DB.table('routing_logs')
      .where({ link_id: linkId })
      .where('routed_at', '>=', startTime)
      .groupBy('rule_id')
      .count('* as routing_count')
      .select('rule_id');
    
    return analytics;
  }
}

export default new DynamicRouter();