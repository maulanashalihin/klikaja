import { Response, Request } from "../../type";
import DB from "../services/DB";

class AnalyticsController {
    
    /**
     * Main analytics dashboard - Overview of all user's links
     */
    public async index(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            // Get date range from query params
            const url = new URL(request.url, `http://${request.headers.host}`);
            const daysParam = url.searchParams.get('days') || '30';
            const days = parseInt(daysParam);
            const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);

            // Get all user's links
            const links = await DB.table("links")
                .where({ user_id: user.id })
                .select('id', 'alias', 'title', 'click_count', 'created_at');

            const linkIds = links.map(l => l.id);

            // Overall stats
            const totalClicks = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .count('* as count')
                .first();

            const uniqueVisitors = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .countDistinct('ip_address as count')
                .first();

            // Clicks over time (grouped by day)
            const clicksOverTime = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select(DB.raw("DATE(datetime(clicked_at / 1000, 'unixepoch')) as date"))
                .count('* as clicks')
                .groupBy('date')
                .orderBy('date', 'asc');

            // Device breakdown
            const deviceBreakdown = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('device_type')
                .count('* as count')
                .groupBy('device_type')
                .orderBy('count', 'desc');

            // Browser breakdown
            const browserBreakdown = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('browser')
                .count('* as count')
                .groupBy('browser')
                .orderBy('count', 'desc')
                .limit(5);

            // OS breakdown
            const osBreakdown = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('os')
                .count('* as count')
                .groupBy('os')
                .orderBy('count', 'desc')
                .limit(5);

            // Top referrers
            const topReferrers = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .whereNotNull('referrer')
                .select('referrer')
                .count('* as count')
                .groupBy('referrer')
                .orderBy('count', 'desc')
                .limit(10);

            // Top performing links
            const topLinks = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('link_id')
                .count('* as clicks')
                .groupBy('link_id')
                .orderBy('clicks', 'desc')
                .limit(5);

            // Enrich top links with link data
            const enrichedTopLinks = await Promise.all(
                topLinks.map(async (item) => {
                    const link = links.find(l => l.id === item.link_id);
                    return {
                        ...item,
                        alias: link?.alias,
                        title: link?.title
                    };
                })
            );

            // Country breakdown
            const countryBreakdown = await DB.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .whereNotNull('country')
                .select('country')
                .count('* as count')
                .groupBy('country')
                .orderBy('count', 'desc')
                .limit(10);

            return response.inertia("Analytics/Index", {
                user,
                stats: {
                    totalClicks: totalClicks?.count || 0,
                    uniqueVisitors: uniqueVisitors?.count || 0,
                    totalLinks: links.length,
                    avgClicksPerLink: links.length > 0 
                        ? Math.round((totalClicks?.count || 0) / links.length) 
                        : 0
                },
                clicksOverTime,
                deviceBreakdown,
                browserBreakdown,
                osBreakdown,
                topReferrers,
                topLinks: enrichedTopLinks,
                countryBreakdown,
                dateRange: {
                    days,
                    startDate,
                    endDate: Date.now()
                }
            });

        } catch (error) {
            console.error("Error loading analytics:", error);
            return response.redirect("/home?error=Gagal memuat analytics");
        }
    }

    /**
     * Analytics for a specific link
     */
    public async show(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            const { alias } = request.params;

            // Get link
            const link = await DB.table("links")
                .where({ alias, user_id: user.id })
                .first();

            if (!link) {
                return response.redirect("/analytics?error=Link tidak ditemukan");
            }

            // Parse URLs
            link.urls = JSON.parse(link.urls);

            // Get date range from query params
            const url = new URL(request.url, `http://${request.headers.host}`);
            const daysParam = url.searchParams.get('days') || '30';
            const days = parseInt(daysParam);
            const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);

            // Total clicks and unique visitors
            const totalClicks = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .count('* as count')
                .first();

            const uniqueVisitors = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .countDistinct('ip_address as count')
                .first();

            // Clicks over time
            const clicksOverTime = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select(DB.raw("DATE(datetime(clicked_at / 1000, 'unixepoch')) as date"))
                .count('* as clicks')
                .groupBy('date')
                .orderBy('date', 'asc');

            // Device breakdown
            const deviceBreakdown = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('device_type')
                .count('* as count')
                .groupBy('device_type')
                .orderBy('count', 'desc');

            // Browser breakdown
            const browserBreakdown = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('browser')
                .count('* as count')
                .groupBy('browser')
                .orderBy('count', 'desc');

            // OS breakdown
            const osBreakdown = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('os')
                .count('* as count')
                .groupBy('os')
                .orderBy('count', 'desc');

            // Referrers
            const referrers = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('referrer')
                .select('referrer')
                .count('* as count')
                .groupBy('referrer')
                .orderBy('count', 'desc')
                .limit(10);

            // Country breakdown
            const countryBreakdown = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('country')
                .select('country')
                .count('* as count')
                .groupBy('country')
                .orderBy('count', 'desc')
                .limit(10);

            // City breakdown
            const cityBreakdown = await DB.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('city')
                .select('city', 'country')
                .count('* as count')
                .groupBy('city', 'country')
                .orderBy('count', 'desc')
                .limit(10);

            // Recent clicks (last 20)
            const recentClicks = await DB.table("analytics")
                .where({ link_id: link.id })
                .select('clicked_at', 'device_type', 'browser', 'os', 'country', 'city', 'referrer')
                .orderBy('clicked_at', 'desc')
                .limit(20);

            return response.inertia("Analytics/Show", {
                user,
                link,
                stats: {
                    totalClicks: totalClicks?.count || 0,
                    uniqueVisitors: uniqueVisitors?.count || 0,
                    clickThroughRate: link.click_count > 0 
                        ? ((totalClicks?.count || 0) / link.click_count * 100).toFixed(2)
                        : 0
                },
                clicksOverTime,
                deviceBreakdown,
                browserBreakdown,
                osBreakdown,
                referrers,
                countryBreakdown,
                cityBreakdown,
                recentClicks,
                dateRange: {
                    days,
                    startDate,
                    endDate: Date.now()
                }
            });

        } catch (error) {
            console.error("Error loading link analytics:", error);
            return response.redirect("/analytics?error=Gagal memuat analytics");
        }
    }

    /**
     * Export analytics data (CSV format)
     */
    public async export(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }

            const { alias } = request.params;

            // Get link
            const link = await DB.table("links")
                .where({ alias, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({ error: "Link not found" });
            }

            // Get all analytics data
            const analytics = await DB.table("analytics")
                .where({ link_id: link.id })
                .select('clicked_at', 'ip_address', 'device_type', 'browser', 'os', 'country', 'city', 'referrer')
                .orderBy('clicked_at', 'desc');

            // Convert to CSV
            const headers = ['Date', 'Time', 'Device', 'Browser', 'OS', 'Country', 'City', 'Referrer'];
            const rows = analytics.map(row => {
                const date = new Date(row.clicked_at);
                return [
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    row.device_type,
                    row.browser,
                    row.os,
                    row.country || '-',
                    row.city || '-',
                    row.referrer || 'Direct'
                ];
            });

            const csv = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            response.setHeader('Content-Type', 'text/csv');
            response.setHeader('Content-Disposition', `attachment; filename="analytics-${alias}-${Date.now()}.csv"`);
            return response.send(csv);

        } catch (error) {
            console.error("Error exporting analytics:", error);
            return response.status(500).json({ error: "Failed to export analytics" });
        }
    }
}

export default new AnalyticsController();
