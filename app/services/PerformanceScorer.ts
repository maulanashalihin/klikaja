import DatabaseService from "./Database";
import AnalyticsTracker from "./AnalyticsTracker";

export interface PerformanceMetrics {
  click_through_rate: number;
  conversion_rate: number;
  bounce_rate: number;
  average_session_duration: number;
  device_performance: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geographic_performance: {
    [country: string]: number;
  };
  time_performance: {
    [hour: number]: number;
  };
  referrer_performance: {
    [referrer: string]: number;
  };
}

export interface PerformanceRecommendation {
  type: 'content' | 'timing' | 'targeting' | 'technical';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  implementation: string;
}

export default class PerformanceScorer {
  private static instance: PerformanceScorer;
  private db: DatabaseService;
  private analytics: AnalyticsTracker;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.analytics = AnalyticsTracker.getInstance();
  }

  public static getInstance(): PerformanceScorer {
    if (!PerformanceScorer.instance) {
      PerformanceScorer.instance = new PerformanceScorer();
    }
    return PerformanceScorer.instance;
  }

  /**
   * Calculate performance score for a link
   */
  public async calculateScore(linkId: number): Promise<{
    score: number;
    metrics: PerformanceMetrics;
    recommendations: PerformanceRecommendation[];
  }> {
    const metrics = await this.calculateMetrics(linkId);
    const score = this.calculateOverallScore(metrics);
    const recommendations = await this.generateRecommendations(linkId, metrics);

    // Store score in database
    await this.storeScore(linkId, score, metrics, recommendations);

    return {
      score,
      metrics,
      recommendations
    };
  }

  /**
   * Calculate detailed metrics
   */
  private async calculateMetrics(linkId: number): Promise<PerformanceMetrics> {
    const now = Date.now();
    const last30Days = now - (30 * 24 * 60 * 60 * 1000);

    // Get analytics data
    const clicks = await this.db.table('analytics')
      .where({ link_id: linkId, event_type: 'click' })
      .where('created_at', '>=', last30Days);

    const conversions = await this.db.table('conversion_events')
      .where({ link_id: linkId })
      .where('created_at', '>=', last30Days);

    // Calculate basic metrics
    const totalClicks = clicks.length;
    const totalConversions = conversions.length;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Device performance
    const devicePerformance = this.calculateDevicePerformance(clicks, conversions);

    // Geographic performance
    const geographicPerformance = this.calculateGeographicPerformance(clicks, conversions);

    // Time performance
    const timePerformance = this.calculateTimePerformance(clicks, conversions);

    // Referrer performance
    const referrerPerformance = this.calculateReferrerPerformance(clicks, conversions);

    // Bounce rate and session duration (simplified calculation)
    const bounceRate = await this.calculateBounceRate(linkId, last30Days);
    const avgSessionDuration = await this.calculateAverageSessionDuration(linkId, last30Days);

    return {
      click_through_rate: 0, // This would need impression data
      conversion_rate: conversionRate,
      bounce_rate: bounceRate,
      average_session_duration: avgSessionDuration,
      device_performance: devicePerformance,
      geographic_performance: geographicPerformance,
      time_performance: timePerformance,
      referrer_performance: referrerPerformance
    };
  }

  /**
   * Calculate device performance
   */
  private calculateDevicePerformance(clicks: any[], conversions: any[]): {
    mobile: number;
    desktop: number;
    tablet: number;
  } {
    const deviceStats = {
      mobile: { clicks: 0, conversions: 0 },
      desktop: { clicks: 0, conversions: 0 },
      tablet: { clicks: 0, conversions: 0 }
    };

    clicks.forEach(click => {
      const device = this.categorizeDevice(click.user_agent);
      deviceStats[device].clicks++;
    });

    conversions.forEach(conversion => {
      // Find corresponding click (simplified)
      const click = clicks.find(c => 
        Math.abs(c.created_at - conversion.created_at) < 1000 * 60 * 30 // Within 30 minutes
      );
      if (click) {
        const device = this.categorizeDevice(click.user_agent);
        deviceStats[device].conversions++;
      }
    });

    return {
      mobile: deviceStats.mobile.clicks > 0 ? 
        (deviceStats.mobile.conversions / deviceStats.mobile.clicks) * 100 : 0,
      desktop: deviceStats.desktop.clicks > 0 ? 
        (deviceStats.desktop.conversions / deviceStats.desktop.clicks) * 100 : 0,
      tablet: deviceStats.tablet.clicks > 0 ? 
        (deviceStats.tablet.conversions / deviceStats.tablet.clicks) * 100 : 0
    };
  }

  /**
   * Calculate geographic performance
   */
  private calculateGeographicPerformance(clicks: any[], conversions: any[]): {
    [country: string]: number;
  } {
    const countryStats = {};

    clicks.forEach(click => {
      if (click.country) {
        if (!countryStats[click.country]) {
          countryStats[click.country] = { clicks: 0, conversions: 0 };
        }
        countryStats[click.country].clicks++;
      }
    });

    conversions.forEach(conversion => {
      // Find corresponding click (simplified)
      const click = clicks.find(c => 
        Math.abs(c.created_at - conversion.created_at) < 1000 * 60 * 30
      );
      if (click && click.country && countryStats[click.country]) {
        countryStats[click.country].conversions++;
      }
    });

    const performance = {};
    Object.keys(countryStats).forEach(country => {
      const stats = countryStats[country];
      performance[country] = stats.clicks > 0 ? 
        (stats.conversions / stats.clicks) * 100 : 0;
    });

    return performance;
  }

  /**
   * Calculate time performance
   */
  private calculateTimePerformance(clicks: any[], conversions: any[]): {
    [hour: number]: number;
  } {
    const hourStats = {};

    clicks.forEach(click => {
      const hour = new Date(click.created_at).getHours();
      if (!hourStats[hour]) {
        hourStats[hour] = { clicks: 0, conversions: 0 };
      }
      hourStats[hour].clicks++;
    });

    conversions.forEach(conversion => {
      const hour = new Date(conversion.created_at).getHours();
      if (hourStats[hour]) {
        hourStats[hour].conversions++;
      }
    });

    const performance = {};
    for (let hour = 0; hour < 24; hour++) {
      if (hourStats[hour]) {
        performance[hour] = hourStats[hour].clicks > 0 ? 
          (hourStats[hour].conversions / hourStats[hour].clicks) * 100 : 0;
      } else {
        performance[hour] = 0;
      }
    }

    return performance;
  }

  /**
   * Calculate referrer performance
   */
  private calculateReferrerPerformance(clicks: any[], conversions: any[]): {
    [referrer: string]: number;
  } {
    const referrerStats = {};

    clicks.forEach(click => {
      const referrer = this.extractReferrerDomain(click.referrer) || 'direct';
      if (!referrerStats[referrer]) {
        referrerStats[referrer] = { clicks: 0, conversions: 0 };
      }
      referrerStats[referrer].clicks++;
    });

    conversions.forEach(conversion => {
      // Find corresponding click (simplified)
      const click = clicks.find(c => 
        Math.abs(c.created_at - conversion.created_at) < 1000 * 60 * 30
      );
      if (click) {
        const referrer = this.extractReferrerDomain(click.referrer) || 'direct';
        if (referrerStats[referrer]) {
          referrerStats[referrer].conversions++;
        }
      }
    });

    const performance = {};
    Object.keys(referrerStats).forEach(referrer => {
      const stats = referrerStats[referrer];
      performance[referrer] = stats.clicks > 0 ? 
        (stats.conversions / stats.clicks) * 100 : 0;
    });

    return performance;
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(metrics: PerformanceMetrics): number {
    const weights = {
      conversion_rate: 0.4,
      bounce_rate: 0.2,
      average_session_duration: 0.2,
      device_performance: 0.1,
      geographic_performance: 0.05,
      time_performance: 0.05
    };

    let score = 0;

    // Conversion rate (0-100%)
    score += metrics.conversion_rate * weights.conversion_rate;

    // Bounce rate (lower is better, so invert)
    score += (100 - metrics.bounce_rate) * weights.bounce_rate;

    // Session duration (normalize to 0-100)
    const maxSessionDuration = 300; // 5 minutes max
    const normalizedSessionDuration = Math.min(
      (metrics.average_session_duration / maxSessionDuration) * 100, 
      100
    );
    score += normalizedSessionDuration * weights.average_session_duration;

    // Device performance (average of all devices)
    const avgDevicePerformance = Object.values(metrics.device_performance)
      .reduce((sum, rate) => sum + rate, 0) / Object.keys(metrics.device_performance).length;
    score += avgDevicePerformance * weights.device_performance;

    // Geographic performance (average of top 5 countries)
    const topCountries = Object.values(metrics.geographic_performance)
      .sort((a, b) => b - a)
      .slice(0, 5);
    const avgGeographicPerformance = topCountries.length > 0 ?
      topCountries.reduce((sum, rate) => sum + rate, 0) / topCountries.length : 0;
    score += avgGeographicPerformance * weights.geographic_performance;

    // Time performance (average of all hours)
    const avgTimePerformance = Object.values(metrics.time_performance)
      .reduce((sum, rate) => sum + rate, 0) / 24;
    score += avgTimePerformance * weights.time_performance;

    return Math.round(score);
  }

  /**
   * Generate recommendations based on metrics
   */
  private async generateRecommendations(
    linkId: number,
    metrics: PerformanceMetrics
  ): Promise<PerformanceRecommendation[]> {
    const recommendations: PerformanceRecommendation[] = [];

    // Check conversion rate
    if (metrics.conversion_rate < 2) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        title: 'Low Conversion Rate',
        description: `Your conversion rate is ${metrics.conversion_rate.toFixed(2)}%, which is below the recommended 2% minimum.`,
        impact: 'High - Improving conversion rate can significantly increase ROI',
        implementation: 'Review your landing page design, call-to-action placement, and offer value proposition.'
      });
    }

    // Check device performance
    if (metrics.device_performance.mobile < metrics.device_performance.desktop * 0.7) {
      recommendations.push({
        type: 'targeting',
        priority: 'high',
        title: 'Mobile Performance Gap',
        description: `Mobile conversion rate (${metrics.device_performance.mobile.toFixed(2)}%) is significantly lower than desktop.`,
        impact: 'High - Mobile traffic often represents 50%+ of total traffic',
        implementation: 'Optimize your mobile landing page experience, check loading speed, and ensure responsive design.'
      });
    }

    // Check bounce rate
    if (metrics.bounce_rate > 70) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        title: 'High Bounce Rate',
        description: `Your bounce rate is ${metrics.bounce_rate.toFixed(2)}%, indicating visitors are leaving immediately.`,
        impact: 'Medium - High bounce rates waste traffic and reduce conversions',
        implementation: 'Improve page load speed, ensure content matches visitor expectations, and add clear navigation.'
      });
    }

    // Check time performance
    const bestHours = Object.entries(metrics.time_performance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (bestHours.length > 0 && bestHours[0][1] > 0) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        title: 'Optimize Timing',
        description: `Best performing hours are ${bestHours.map(([hour]) => `${hour}:00`).join(', ')}.`,
        impact: 'Medium - Timing optimization can improve conversion rates by 15-25%',
        implementation: 'Schedule your marketing campaigns and social media posts during these peak hours.'
      });
    }

    return recommendations;
  }

  /**
   * Store score in database
   */
  private async storeScore(
    linkId: number,
    score: number,
    metrics: PerformanceMetrics,
    recommendations: PerformanceRecommendation[]
  ): Promise<void> {
    await this.db.table('link_performance_scores').insert({
      link_id: linkId,
      score,
      metrics: JSON.stringify(metrics),
      recommendations: JSON.stringify(recommendations),
      calculated_at: Date.now()
    }).onConflict('link_id').merge();
  }

  /**
   * Get stored performance score
   */
  public async getScore(linkId: number): Promise<any> {
    const result = await this.db.table('link_performance_scores')
      .where({ link_id: linkId })
      .first();

    if (!result) {
      return await this.calculateScore(linkId);
    }

    return {
      score: result.score,
      metrics: JSON.parse(result.metrics),
      recommendations: JSON.parse(result.recommendations),
      calculated_at: result.calculated_at
    };
  }

  /**
   * Helper methods
   */
  private categorizeDevice(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(ua)) return 'mobile';
    if (/tablet|ipad/.test(ua)) return 'tablet';
    return 'desktop';
  }

  private extractReferrerDomain(referrer: string): string | null {
    if (!referrer) return null;
    try {
      const url = new URL(referrer);
      return url.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  private async calculateBounceRate(linkId: number, startTime: number): Promise<number> {
    // Simplified bounce rate calculation
    const clicks = await this.db.table('analytics')
      .where({ link_id: linkId, event_type: 'click' })
      .where('created_at', '>=', startTime)
      .count('* as count')
      .first();

    const pageViews = await this.db.table('analytics')
      .where({ link_id: linkId, event_type: 'page_view' })
      .where('created_at', '>=', startTime)
      .count('* as count')
      .first();

    if (clicks?.count > 0) {
      return ((clicks.count - (pageViews?.count || 0)) / clicks.count) * 100;
    }

    return 0;
  }

  private async calculateAverageSessionDuration(linkId: number, startTime: number): Promise<number> {
    // Simplified session duration calculation
    const events = await this.db.table('analytics')
      .where({ link_id: linkId })
      .where('created_at', '>=', startTime)
      .orderBy('created_at', 'asc');

    if (events.length < 2) return 0;

    let totalDuration = 0;
    let sessionCount = 0;

    for (let i = 1; i < events.length; i++) {
      const duration = events[i].created_at - events[i - 1].created_at;
      if (duration < 1000 * 60 * 30) { // Less than 30 minutes
        totalDuration += duration;
        sessionCount++;
      }
    }

    return sessionCount > 0 ? totalDuration / sessionCount / 1000 : 0; // Return seconds
  }
}