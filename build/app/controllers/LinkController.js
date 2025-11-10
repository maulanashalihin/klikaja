"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../services/DB"));
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const Authenticate_1 = __importDefault(require("../services/Authenticate"));
function generateRandomAlias(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let alias = '';
    for (let i = 0; i < length; i++) {
        alias += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return alias;
}
function getWeightedUrl(urls) {
    const totalWeight = urls.reduce((sum, item) => {
        return sum + (item.weight || 1);
    }, 0);
    let random = Math.random() * totalWeight;
    for (const item of urls) {
        const weight = item.weight || 1;
        random -= weight;
        if (random <= 0) {
            return typeof item === 'string' ? item : item.url;
        }
    }
    return typeof urls[0] === 'string' ? urls[0] : urls[0].url;
}
function getDeviceType(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return 'mobile';
    }
    else if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'tablet';
    }
    else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
        return 'bot';
    }
    return 'desktop';
}
function getBrowser(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome'))
        return 'Chrome';
    if (ua.includes('firefox'))
        return 'Firefox';
    if (ua.includes('safari'))
        return 'Safari';
    if (ua.includes('edge'))
        return 'Edge';
    if (ua.includes('opera'))
        return 'Opera';
    return 'Unknown';
}
function getOS(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows'))
        return 'Windows';
    if (ua.includes('mac'))
        return 'MacOS';
    if (ua.includes('linux'))
        return 'Linux';
    if (ua.includes('android'))
        return 'Android';
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad'))
        return 'iOS';
    return 'Unknown';
}
async function trackClick(linkId, request) {
    try {
        const userAgent = request.headers['user-agent'] || '';
        const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        const referer = request.headers['referer'] || request.headers['referrer'] || null;
        const deviceType = getDeviceType(userAgent);
        const browser = getBrowser(userAgent);
        const os = getOS(userAgent);
        const url = new URL(request.url, `http://${request.headers.host}`);
        const utmSource = url.searchParams.get('utm_source');
        const utmMedium = url.searchParams.get('utm_medium');
        const utmCampaign = url.searchParams.get('utm_campaign');
        await DB_1.default.table("analytics").insert({
            id: (0, uuid_1.v4)(),
            link_id: linkId,
            clicked_at: Date.now(),
            ip_address: typeof ip === 'string' ? ip : ip[0],
            user_agent: userAgent,
            device_type: deviceType,
            browser: browser,
            os: os,
            country: null,
            city: null,
            region: null,
            referrer: referer,
            referrer_domain: referer ? new URL(referer).hostname : null,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: url.searchParams.get('utm_term'),
            utm_content: url.searchParams.get('utm_content')
        });
    }
    catch (error) {
        console.error("Error tracking analytics:", error);
    }
}
class LinkController {
    async index(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const url = new URL(request.url, `http://${request.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');
            const limit = parseInt(url.searchParams.get('limit') || '10');
            const search = url.searchParams.get('search') || '';
            const status = url.searchParams.get('status') || 'all';
            const offset = (page - 1) * limit;
            let query = DB_1.default.table("links")
                .where({ user_id: user.id });
            if (search) {
                query = query.where(function () {
                    this.where('alias', 'like', `%${search}%`)
                        .orWhere('title', 'like', `%${search}%`)
                        .orWhere('description', 'like', `%${search}%`);
                });
            }
            if (status === 'active') {
                query = query.where({ is_active: 1 });
            }
            else if (status === 'inactive') {
                query = query.where({ is_active: 0 });
            }
            const totalResult = await query.clone().count('* as count');
            const total = totalResult[0].count;
            const links = await query
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);
            links.forEach(link => {
                link.urls = JSON.parse(link.urls);
            });
            const totalPages = Math.ceil(total / limit);
            return response.inertia("Links/Index", {
                user,
                links,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                },
                filters: {
                    search,
                    status
                }
            });
        }
        catch (error) {
            console.error("Error loading links:", error);
            return response.redirect("/home?error=Gagal memuat links");
        }
    }
    async storeAnonymous(request, response) {
        try {
            const { url, alias } = await request.json();
            if (!url) {
                return response.status(400).json({
                    error: "URL is required"
                });
            }
            const linkAlias = alias || generateRandomAlias();
            const existingLink = await DB_1.default.from("links").where({ alias: linkAlias }).first();
            if (existingLink) {
                return response.status(400).json({
                    error: "Alias already taken. Please choose another one."
                });
            }
            const claimToken = crypto_1.default.randomBytes(32).toString('hex');
            const linkId = (0, uuid_1.v4)();
            const now = Date.now();
            await DB_1.default.table("links").insert({
                id: linkId,
                user_id: null,
                alias: linkAlias,
                urls: JSON.stringify([url]),
                rotation_method: 'random',
                current_index: 0,
                title: null,
                description: null,
                password: null,
                expires_at: null,
                max_clicks: null,
                click_count: 0,
                is_active: true,
                is_claimed: false,
                claim_token: claimToken,
                qr_code_path: null,
                created_at: now,
                updated_at: now
            });
            await DB_1.default.table("link_claims").insert({
                id: (0, uuid_1.v4)(),
                link_id: linkId,
                claim_token: claimToken,
                expires_at: now + (7 * 24 * 60 * 60 * 1000),
                created_at: now
            });
            return response.redirect(`/result/${claimToken}`);
        }
        catch (error) {
            console.error("Error creating link:", error);
            return response.status(500).json({
                error: "Failed to create link"
            });
        }
    }
    async showResult(request, response) {
        try {
            const { claim_token } = request.params;
            const link = await DB_1.default.from("links")
                .where({ claim_token })
                .first();
            if (!link) {
                return response.redirect("/");
            }
            const urls = JSON.parse(link.urls);
            const originalUrl = urls[0];
            const protocol = process.env.APP_URL.includes("https") ? 'https' : 'http';
            const host = request.headers.host || 'localhost:3000';
            const shortUrl = `${protocol}://${host}/${link.alias}`;
            return response.inertia("Links/Result", {
                link: {
                    alias: link.alias,
                    short_url: shortUrl,
                    original_url: originalUrl,
                    qr_code_path: link.qr_code_path,
                    claim_token: link.claim_token,
                    created_at: link.created_at
                }
            });
        }
        catch (error) {
            console.error("Error showing result:", error);
            return response.redirect("/");
        }
    }
    async redirect(request, response) {
        try {
            const { alias } = request.params;
            const link = await DB_1.default.from("links")
                .where({ alias, is_active: true })
                .first();
            if (!link) {
                return response.status(404).send("Link not found");
            }
            if (link.expires_at && Date.now() > link.expires_at) {
                return response.status(410).send("Link has expired");
            }
            if (link.max_clicks && link.click_count >= link.max_clicks) {
                return response.status(410).send("Link has reached maximum clicks");
            }
            if (link.password) {
                const providedPassword = request.query.password || request.body?.password;
                if (!providedPassword) {
                    return response.inertia("Links/Password", {
                        alias: link.alias,
                        title: link.title
                    });
                }
                const isPasswordValid = await Authenticate_1.default.compare(providedPassword, link.password);
                if (!isPasswordValid) {
                    return response.inertia("Links/Password", {
                        alias: link.alias,
                        title: link.title,
                        error: "Password salah!"
                    });
                }
            }
            const urls = JSON.parse(link.urls);
            let destinationUrl = urls[0];
            if (urls.length > 1) {
                if (link.rotation_method === 'sequential') {
                    destinationUrl = urls[link.current_index];
                    const nextIndex = (link.current_index + 1) % urls.length;
                    await DB_1.default.table("links")
                        .where({ id: link.id })
                        .update({ current_index: nextIndex });
                }
                else if (link.rotation_method === 'random') {
                    const randomIndex = Math.floor(Math.random() * urls.length);
                    destinationUrl = urls[randomIndex];
                }
                else if (link.rotation_method === 'weighted') {
                    destinationUrl = getWeightedUrl(urls);
                }
            }
            trackClick(link.id, request).catch(err => {
                console.error("Error tracking click:", err);
            });
            await DB_1.default.table("links")
                .where({ id: link.id })
                .increment('click_count', 1);
            return response.redirect(destinationUrl);
        }
        catch (error) {
            console.error("Error redirecting:", error);
            return response.status(500).send("Internal server error");
        }
    }
    async checkAlias(request, response) {
        try {
            const { alias } = request.params;
            const existingLink = await DB_1.default.from("links")
                .where({ alias })
                .first();
            return response.json({
                available: !existingLink
            });
        }
        catch (error) {
            console.error("Error checking alias:", error);
            return response.status(500).json({
                error: "Failed to check alias"
            });
        }
    }
    async claimLink(request, response) {
        try {
            const { claim_token } = request.params;
            const is_auth = request.cookies.auth_id;
            let user;
            if (!is_auth) {
                return response.redirect(`/register?redirect=/claim/${claim_token}`);
            }
            if (is_auth) {
                const session = await DB_1.default.from("sessions").where("id", request.cookies.auth_id).first();
                if (!session) {
                    return response.redirect(`/register?redirect=/claim/${claim_token}`);
                }
                user = await DB_1.default.from("users").where("id", session.user_id).select(["id", "name", "email", "phone", "is_admin", "is_verified"]).first();
            }
            const link = await DB_1.default.from("links")
                .where({ claim_token, is_claimed: false })
                .first();
            if (!link) {
                return response.inertia("Home/Index", {
                    error: "Link tidak ditemukan atau sudah diklaim"
                });
            }
            const claimRecord = await DB_1.default.from("link_claims")
                .where({ claim_token })
                .first();
            if (!claimRecord) {
                return response.inertia("Home/Index", {
                    error: "Token klaim tidak valid"
                });
            }
            if (Date.now() > claimRecord.expires_at) {
                return response.inertia("Home/Index", {
                    error: "Token klaim sudah kadaluarsa"
                });
            }
            await DB_1.default.table("links")
                .where({ id: link.id })
                .update({
                user_id: user.id,
                is_claimed: true,
                claim_token: null,
                updated_at: Date.now()
            });
            await DB_1.default.table("link_claims")
                .where({ claim_token })
                .delete();
            return response.redirect(`/home?success=Link ${link.alias} berhasil diklaim!`);
        }
        catch (error) {
            console.error("Error claiming link:", error);
            return response.redirect("/?error=Gagal mengklaim link");
        }
    }
    async create(request, response) {
        const user = request.user;
        if (!user) {
            return response.redirect("/login");
        }
        return response.inertia("Links/Create", {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    async store(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const { urls, alias, title, description, rotation_method = 'random', password, expires_at, max_clicks } = await request.json();
            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                return response.status(400).json({
                    error: "At least one URL is required"
                });
            }
            let finalAlias = alias;
            if (!finalAlias) {
                let attempts = 0;
                do {
                    finalAlias = generateRandomAlias(6);
                    const existing = await DB_1.default.from("links")
                        .where({ alias: finalAlias })
                        .first();
                    if (!existing)
                        break;
                    attempts++;
                } while (attempts < 10);
                if (attempts >= 10) {
                    return response.status(500).json({
                        error: "Failed to generate unique alias"
                    });
                }
            }
            else {
                const existing = await DB_1.default.from("links")
                    .where({ alias: finalAlias })
                    .first();
                if (existing) {
                    return response.status(400).json({
                        error: "Alias already taken"
                    });
                }
                if (!/^[a-zA-Z0-9-_]+$/.test(finalAlias)) {
                    return response.status(400).json({
                        error: "Alias can only contain letters, numbers, dashes, and underscores"
                    });
                }
            }
            let hashedPassword = null;
            if (password) {
                hashedPassword = await Authenticate_1.default.hash(password);
            }
            const linkId = (0, uuid_1.v4)();
            const now = Date.now();
            await DB_1.default.table("links").insert({
                id: linkId,
                user_id: user.id,
                alias: finalAlias,
                urls: JSON.stringify(urls),
                rotation_method,
                current_index: 0,
                title: title || null,
                description: description || null,
                password: hashedPassword,
                expires_at: expires_at || null,
                max_clicks: max_clicks || null,
                click_count: 0,
                is_active: true,
                is_claimed: true,
                claim_token: null,
                qr_code_path: null,
                created_at: now,
                updated_at: now
            });
            return response.redirect(`/home?success=Link berhasil dibuat!`);
        }
        catch (error) {
            console.error("Error creating link:", error);
            return response.status(500).json({
                error: "Failed to create link"
            });
        }
    }
    async edit(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const { id } = request.params;
            const link = await DB_1.default.table("links")
                .where({ id, user_id: user.id })
                .first();
            if (!link) {
                return response.redirect("/links?error=Link tidak ditemukan");
            }
            link.urls = JSON.parse(link.urls);
            return response.inertia("Links/Edit", {
                user,
                link
            });
        }
        catch (error) {
            console.error("Error loading edit form:", error);
            return response.redirect("/links?error=Gagal memuat form edit");
        }
    }
    async update(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const { id } = request.params;
            const body = await request.json();
            const { urls, title, description, rotation_method = "random", password, expires_at, max_clicks, is_active = true } = body;
            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                return response.status(400).json({
                    error: "At least one URL is required"
                });
            }
            const link = await DB_1.default.table("links")
                .where({ id, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }
            const updateData = {
                urls: JSON.stringify(urls),
                rotation_method,
                title: title || null,
                description: description || null,
                expires_at: expires_at || null,
                max_clicks: max_clicks || null,
                is_active: is_active ? 1 : 0,
                updated_at: Date.now()
            };
            if (password && password.trim() !== '') {
                updateData.password = await Authenticate_1.default.hash(password);
            }
            await DB_1.default.table("links")
                .where({ id })
                .update(updateData);
            return response.send("OK");
        }
        catch (error) {
            console.error("Error updating link:", error);
            return response.status(500).json({
                error: "Failed to update link"
            });
        }
    }
    async show(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }
            const { id } = request.params;
            const link = await DB_1.default.table("links")
                .where({ id, user_id: user.id })
                .first();
            if (!link) {
                return response.redirect("/links?error=Link tidak ditemukan");
            }
            link.urls = JSON.parse(link.urls);
            const analytics = await DB_1.default.table("analytics")
                .where({ link_id: id })
                .select(DB_1.default.raw('COUNT(*) as total_clicks'), DB_1.default.raw('COUNT(DISTINCT ip_address) as unique_visitors'));
            return response.inertia("Links/Show", {
                user,
                link,
                analytics: analytics[0] || { total_clicks: 0, unique_visitors: 0 }
            });
        }
        catch (error) {
            console.error("Error loading link details:", error);
            return response.redirect("/links?error=Gagal memuat detail link");
        }
    }
    async destroy(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({
                    error: "Unauthorized"
                });
            }
            const { id } = request.params;
            const link = await DB_1.default.table("links")
                .where({ id, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }
            await DB_1.default.table("analytics")
                .where({ link_id: id })
                .delete();
            await DB_1.default.table("links")
                .where({ id })
                .delete();
            return response.json({
                success: true,
                message: "Link berhasil dihapus"
            });
        }
        catch (error) {
            console.error("Error deleting link:", error);
            return response.status(500).json({
                error: "Failed to delete link"
            });
        }
    }
    async toggle(request, response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({
                    error: "Unauthorized"
                });
            }
            const { id } = request.params;
            const link = await DB_1.default.table("links")
                .where({ id, user_id: user.id })
                .first();
            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }
            const newStatus = link.is_active ? 0 : 1;
            await DB_1.default.table("links")
                .where({ id })
                .update({
                is_active: newStatus,
                updated_at: Date.now()
            });
            return response.json({
                success: true,
                is_active: newStatus === 1,
                message: newStatus === 1 ? "Link diaktifkan" : "Link dinonaktifkan"
            });
        }
        catch (error) {
            console.error("Error toggling link status:", error);
            return response.status(500).json({
                error: "Failed to toggle link status"
            });
        }
    }
}
exports.default = new LinkController();
//# sourceMappingURL=LinkController.js.map