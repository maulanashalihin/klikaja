"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
class AnalyticsController {
    async index(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const url = new URL(request.url, `http://${request.headers.host}`);
            const daysParam = url.searchParams.get('days') || '30';
            const days = parseInt(daysParam);
            const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
            const links = await DB_1.default.table("links")
                .where({ user_id: user.id })
                .select('id', 'alias', 'title', 'click_count', 'created_at');
            const linkIds = links.map(l => l.id);
            const totalClicks = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .count('* as count')
                .first();
            const uniqueVisitors = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .countDistinct('ip_address as count')
                .first();
            const clicksOverTime = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select(DB_1.default.raw("DATE(datetime(clicked_at / 1000, 'unixepoch')) as date"))
                .count('* as clicks')
                .groupBy('date')
                .orderBy('date', 'asc');
            const deviceBreakdown = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('device_type')
                .count('* as count')
                .groupBy('device_type')
                .orderBy('count', 'desc');
            const browserBreakdown = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('browser')
                .count('* as count')
                .groupBy('browser')
                .orderBy('count', 'desc')
                .limit(5);
            const osBreakdown = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('os')
                .count('* as count')
                .groupBy('os')
                .orderBy('count', 'desc')
                .limit(5);
            const topReferrers = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .whereNotNull('referrer')
                .select('referrer')
                .count('* as count')
                .groupBy('referrer')
                .orderBy('count', 'desc')
                .limit(10);
            const topLinks = await DB_1.default.table("analytics")
                .whereIn('link_id', linkIds)
                .where('clicked_at', '>=', startDate)
                .select('link_id')
                .count('* as clicks')
                .groupBy('link_id')
                .orderBy('clicks', 'desc')
                .limit(5);
            const enrichedTopLinks = await Promise.all(topLinks.map(async (item) => {
                const link = links.find(l => l.id === item.link_id);
                return {
                    ...item,
                    alias: link?.alias,
                    title: link?.title
                };
            }));
            const countryBreakdown = await DB_1.default.table("analytics")
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
        }
        catch (error) {
            console.error("Error loading analytics:", error);
            return response.redirect("/home?error=Gagal memuat analytics");
        }
    }
    async show(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const { alias } = request.params;
            const link = await DB_1.default.table("links")
                .where({ alias, user_id: user.id })
                .first();
            if (!link) {
                return response.redirect("/analytics?error=Link tidak ditemukan");
            }
            link.urls = JSON.parse(link.urls);
            const url = new URL(request.url, `http://${request.headers.host}`);
            const daysParam = url.searchParams.get('days') || '30';
            const days = parseInt(daysParam);
            const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
            const totalClicks = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .count('* as count')
                .first();
            const uniqueVisitors = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .countDistinct('ip_address as count')
                .first();
            const clicksOverTime = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select(DB_1.default.raw("DATE(datetime(clicked_at / 1000, 'unixepoch')) as date"))
                .count('* as clicks')
                .groupBy('date')
                .orderBy('date', 'asc');
            const deviceBreakdown = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('device_type')
                .count('* as count')
                .groupBy('device_type')
                .orderBy('count', 'desc');
            const browserBreakdown = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('browser')
                .count('* as count')
                .groupBy('browser')
                .orderBy('count', 'desc');
            const osBreakdown = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .select('os')
                .count('* as count')
                .groupBy('os')
                .orderBy('count', 'desc');
            const referrers = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('referrer')
                .select('referrer')
                .count('* as count')
                .groupBy('referrer')
                .orderBy('count', 'desc')
                .limit(10);
            const countryBreakdown = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('country')
                .select('country')
                .count('* as count')
                .groupBy('country')
                .orderBy('count', 'desc')
                .limit(10);
            const cityBreakdown = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .where('clicked_at', '>=', startDate)
                .whereNotNull('city')
                .select('city', 'country')
                .count('* as count')
                .groupBy('city', 'country')
                .orderBy('count', 'desc')
                .limit(10);
            const recentClicks = await DB_1.default.table("analytics")
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
        }
        catch (error) {
            console.error("Error loading link analytics:", error);
            return response.redirect("/analytics?error=Gagal memuat analytics");
        }
    }
    async export(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({ error: "Unauthorized" });
            }
            const { alias } = request.params;
            const link = await DB_1.default.table("links")
                .where({ alias, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({ error: "Link not found" });
            }
            const analytics = await DB_1.default.table("analytics")
                .where({ link_id: link.id })
                .select('clicked_at', 'ip_address', 'device_type', 'browser', 'os', 'country', 'city', 'referrer')
                .orderBy('clicked_at', 'desc');
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
        }
        catch (error) {
            console.error("Error exporting analytics:", error);
            return response.status(500).json({ error: "Failed to export analytics" });
        }
    }
}
exports.default = new AnalyticsController();
//# sourceMappingURL=AnalyticsController.js.map