import { Response, Request } from "../../type";
import DB from "../services/DB";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Authenticate from "../services/Authenticate";

/**
 * Helper Functions
 */

/**
 * Generate random alias
 */
function generateRandomAlias(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let alias = '';
    for (let i = 0; i < length; i++) {
        alias += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return alias;
}

/**
 * Get weighted URL from array
 */
function getWeightedUrl(urls: any[]): string {
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

/**
 * Get device type from user agent
 */
function getDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'tablet';
    } else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
        return 'bot';
    }
    return 'desktop';
}

/**
 * Get browser from user agent
 */
function getBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    return 'Unknown';
}

/**
 * Get OS from user agent
 */
function getOS(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'MacOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Unknown';
}

/**
 * Track click analytics
 */
async function trackClick(linkId: string, request: Request): Promise<void> {
    try {
        const userAgent = request.headers['user-agent'] || '';
        const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        const referer = request.headers['referer'] || request.headers['referrer'] || null;

        // Parse device type from user agent
        const deviceType = getDeviceType(userAgent);
        const browser = getBrowser(userAgent);
        const os = getOS(userAgent);

        // Extract UTM parameters
        const url = new URL(request.url, `http://${request.headers.host}`);
        const utmSource = url.searchParams.get('utm_source');
        const utmMedium = url.searchParams.get('utm_medium');
        const utmCampaign = url.searchParams.get('utm_campaign');

        await DB.table("analytics").insert({
            id: uuidv4(),
            link_id: linkId,
            clicked_at: Date.now(),
            ip_address: typeof ip === 'string' ? ip : ip[0],
            user_agent: userAgent,
            device_type: deviceType,
            browser: browser,
            os: os,
            country: null, // TODO: Get from IP geolocation
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

    } catch (error) {
        console.error("Error tracking analytics:", error);
        // Don't throw, just log
    }
}

class LinkController {
    
    /**
     * List all user's links with pagination and filters
     */
    public async index(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            // Get query parameters
            const url = new URL(request.url, `http://${request.headers.host}`);
            const page = parseInt(url.searchParams.get('page') || '1');
            const limit = parseInt(url.searchParams.get('limit') || '10');
            const search = url.searchParams.get('search') || '';
            const status = url.searchParams.get('status') || 'all'; // all, active, inactive
            const offset = (page - 1) * limit;

            // Build query
            let query = DB.table("links")
                .where({ user_id: user.id });

            // Apply search filter
            if (search) {
                query = query.where(function() {
                    this.where('alias', 'like', `%${search}%`)
                        .orWhere('title', 'like', `%${search}%`)
                        .orWhere('description', 'like', `%${search}%`);
                });
            }

            // Apply status filter
            if (status === 'active') {
                query = query.where({ is_active: 1 });
            } else if (status === 'inactive') {
                query = query.where({ is_active: 0 });
            }

            // Get total count
            const totalResult = await query.clone().count('* as count');
            const total = totalResult[0].count;

            // Get links with pagination
            const links = await query
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);

            // Parse URLs from JSON
            links.forEach(link => {
                link.urls = JSON.parse(link.urls);
            });

            // Calculate pagination
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

        } catch (error) {
            console.error("Error loading links:", error);
            return response.redirect("/home?error=Gagal memuat links");
        }
    }

    /**
     * Create anonymous link (no login required)
     */
    public async storeAnonymous(request: Request, response: Response) {
        try {
            const { url, alias } = await request.json();

            // Validate URL
            if (!url) {
                return response.status(400).json({
                    error: "URL is required"
                });
            }

            // Generate alias if not provided
            const linkAlias = alias || generateRandomAlias();

            // Check if alias already exists
            const existingLink = await DB.from("links").where({ alias: linkAlias }).first();
            if (existingLink) {
                return response.status(400).json({
                    error: "Alias already taken. Please choose another one."
                });
            }

            // Generate claim token for anonymous links
            const claimToken = crypto.randomBytes(32).toString('hex');

            // Create link
            const linkId = uuidv4();
            const now = Date.now();

            await DB.table("links").insert({
                id: linkId,
                user_id: null, // Anonymous link
                alias: linkAlias,
                urls: JSON.stringify([url]), // Single URL for now
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
                qr_code_path: null, // TODO: Generate QR code
                created_at: now,
                updated_at: now
            });

            // Create claim token record
            await DB.table("link_claims").insert({
                id: uuidv4(),
                link_id: linkId,
                claim_token: claimToken,
                expires_at: now + (7 * 24 * 60 * 60 * 1000), // 7 days
                created_at: now
            });

            // Redirect to result page
            return response.redirect(`/result/${claimToken}`);

        } catch (error) {
            console.error("Error creating link:", error);
            return response.status(500).json({
                error: "Failed to create link"
            });
        }
    }

    /**
     * Show result page for anonymous link
     */
    public async showResult(request: Request, response: Response) {
        try {
            const { claim_token } = request.params;

            // Find link by claim token
            const link = await DB.from("links")
                .where({ claim_token })
                .first();

            if (!link) {
                return response.redirect("/");
            }

            // Parse URLs
            const urls = JSON.parse(link.urls);
            const originalUrl = urls[0]; // Get first URL

            // Get base URL for short link
            const protocol = request.secure ? 'https' : 'http';
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

        } catch (error) {
            console.error("Error showing result:", error);
            return response.redirect("/");
        }
    }

    /**
     * Handle short link redirect
     */
    public async redirect(request: Request, response: Response) {
        try {
            const { alias } = request.params;

            // Find link by alias
            const link = await DB.from("links")
                .where({ alias, is_active: true })
                .first();

            if (!link) {
                return response.status(404).send("Link not found");
            }

            // Check expiration
            if (link.expires_at && Date.now() > link.expires_at) {
                return response.status(410).send("Link has expired");
            }

            // Check max clicks
            if (link.max_clicks && link.click_count >= link.max_clicks) {
                return response.status(410).send("Link has reached maximum clicks");
            }

            // Parse URLs
            const urls = JSON.parse(link.urls);
            let destinationUrl = urls[0];

            // Handle rotation if multiple URLs
            if (urls.length > 1) {
                if (link.rotation_method === 'sequential') {
                    destinationUrl = urls[link.current_index];
                    // Update index for next click
                    const nextIndex = (link.current_index + 1) % urls.length;
                    await DB.table("links")
                        .where({ id: link.id })
                        .update({ current_index: nextIndex });
                } else if (link.rotation_method === 'random') {
                    const randomIndex = Math.floor(Math.random() * urls.length);
                    destinationUrl = urls[randomIndex];
                } else if (link.rotation_method === 'weighted') {
                    // Weighted rotation (URLs should have weight property)
                    destinationUrl = getWeightedUrl(urls);
                }
            }

            // Track analytics (async, don't wait)
            trackClick(link.id, request).catch(err => {
                console.error("Error tracking click:", err);
            });

            // Increment click count
            await DB.table("links")
                .where({ id: link.id })
                .increment('click_count', 1);

            // Redirect to destination
            return response.redirect(destinationUrl);

        } catch (error) {
            console.error("Error redirecting:", error);
            return response.status(500).send("Internal server error");
        }
    }

    /**
     * Check alias availability (AJAX)
     */
    public async checkAlias(request: Request, response: Response) {
        try {
            const { alias } = request.params;

            const existingLink = await DB.from("links")
                .where({ alias })
                .first();

            return response.json({
                available: !existingLink
            });

        } catch (error) {
            console.error("Error checking alias:", error);
            return response.status(500).json({
                error: "Failed to check alias"
            });
        }
    }

    /**
     * Claim anonymous link (requires authentication)
     */
    public async claimLink(request: Request, response: Response) {
        try {
            const { claim_token } = request.params;
             

            const is_auth = request.cookies.auth_id;

            let user;
            

            // Check if user is authenticated
            if (!is_auth) {
                // Redirect to login with return URL
                return response.redirect(`/register?redirect=/claim/${claim_token}`);
            }

            if(is_auth)
            {
                const session = await DB.from("sessions").where("id",request.cookies.auth_id).first();

                if(!session)
                {
                    return response.redirect(`/register?redirect=/claim/${claim_token}`);
                }

                user = await DB.from("users").where("id",session.user_id).select(["id","name","email","phone","is_admin","is_verified"]).first();
            }

            // Find link by claim token
            const link = await DB.from("links")
                .where({ claim_token, is_claimed: false })
                .first();

            if (!link) {
                return response.inertia("Home/Index", {
                    error: "Link tidak ditemukan atau sudah diklaim"
                });
            }

            // Check if claim token is still valid
            const claimRecord = await DB.from("link_claims")
                .where({ claim_token })
                .first();

            if (!claimRecord) {
                return response.inertia("Home/Index", {
                    error: "Token klaim tidak valid"
                });
            }

            // Check expiration (7 days)
            if (Date.now() > claimRecord.expires_at) {
                return response.inertia("Home/Index", {
                    error: "Token klaim sudah kadaluarsa"
                });
            }

            // Claim the link
            await DB.table("links")
                .where({ id: link.id })
                .update({
                    user_id: user.id,
                    is_claimed: true,
                    claim_token: null, // Remove claim token
                    updated_at: Date.now()
                });

            // Delete claim token record
            await DB.table("link_claims")
                .where({ claim_token })
                .delete();

            // Redirect to home/dashboard with success message
            return response.redirect(`/home?success=Link ${link.alias} berhasil diklaim!`);

        } catch (error) {
            console.error("Error claiming link:", error);
            return response.redirect("/?error=Gagal mengklaim link");
        }
    }

    /**
     * Show create link form
     */
    public async create(request: Request, response: Response) {
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

    /**
     * Store new link (authenticated users)
     */
    public async store(request: Request, response: Response) {
        try {
            const user = request.user;

            if (!user) {
                return response.redirect("/login");
            }

            const {
                urls,
                alias,
                title,
                description,
                rotation_method = 'random',
                password,
                expires_at,
                max_clicks
            } = await request.json();

            // Validate URLs
            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                return response.status(400).json({
                    error: "At least one URL is required"
                });
            }

            // Generate or validate alias
            let finalAlias = alias;
            if (!finalAlias) {
                // Generate random alias
                let attempts = 0;
                do {
                    finalAlias = generateRandomAlias(6);
                    const existing = await DB.from("links")
                        .where({ alias: finalAlias })
                        .first();
                    if (!existing) break;
                    attempts++;
                } while (attempts < 10);

                if (attempts >= 10) {
                    return response.status(500).json({
                        error: "Failed to generate unique alias"
                    });
                }
            } else {
                // Check if alias is available
                const existing = await DB.from("links")
                    .where({ alias: finalAlias })
                    .first();

                if (existing) {
                    return response.status(400).json({
                        error: "Alias already taken"
                    });
                }

                // Validate alias format
                if (!/^[a-zA-Z0-9-_]+$/.test(finalAlias)) {
                    return response.status(400).json({
                        error: "Alias can only contain letters, numbers, dashes, and underscores"
                    });
                }
            }

            // Hash password if provided
            let hashedPassword = null;
            if (password) { 
                hashedPassword = await Authenticate.hash(password);
            }

            // Create link
            const linkId = uuidv4();
            const now = Date.now();

            await DB.table("links").insert({
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
                is_claimed: true, // Authenticated links are already claimed
                claim_token: null,
                qr_code_path: null,
                created_at: now,
                updated_at: now
            });

            // Redirect to link details or links list
            return response.redirect(`/home?success=Link berhasil dibuat!`);

        } catch (error) {
            console.error("Error creating link:", error);
            return response.status(500).json({
                error: "Failed to create link"
            });
        }
    }

    /**
     * Show edit link form
     */
    public async edit(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            const { id } = request.params;

            // Get link
            const link = await DB.table("links")
                .where({ id, user_id: user.id })
                .first();

            if (!link) {
                return response.redirect("/links?error=Link tidak ditemukan");
            }

            // Parse URLs from JSON
            link.urls = JSON.parse(link.urls);

            return response.inertia("Links/Edit", {
                user,
                link
            });

        } catch (error) {
            console.error("Error loading edit form:", error);
            return response.redirect("/links?error=Gagal memuat form edit");
        }
    }

    /**
     * Update existing link
     */
    public async update(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            const { id } = request.params;
            const body = await request.json();
            const {
                urls,
                title,
                description,
                rotation_method = "random",
                password,
                expires_at,
                max_clicks,
                is_active = true
            } = body;

            // Validate URLs
            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                return response.status(400).json({
                    error: "At least one URL is required"
                });
            }

            // Get existing link
            const link = await DB.table("links")
                .where({ id, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }

            // Prepare update data
            const updateData: any = {
                urls: JSON.stringify(urls),
                rotation_method,
                title: title || null,
                description: description || null,
                expires_at: expires_at || null,
                max_clicks: max_clicks || null,
                is_active: is_active ? 1 : 0,
                updated_at: Date.now()
            };

            // Update password if provided
            if (password && password.trim() !== '') {
                updateData.password = await Authenticate.hash(password);
            }

            // Update link
            await DB.table("links")
                .where({ id })
                .update(updateData);

            return response.redirect(`/links?success=Link berhasil diupdate!`);

        } catch (error) {
            console.error("Error updating link:", error);
            return response.status(500).json({
                error: "Failed to update link"
            });
        }
    }

    /**
     * Show single link details
     */
    public async show(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.redirect("/login");
            }

            const { id } = request.params;

            // Get link with analytics count
            const link = await DB.table("links")
                .where({ id, user_id: user.id })
                .first();

            if (!link) {
                return response.redirect("/links?error=Link tidak ditemukan");
            }

            // Parse URLs from JSON
            link.urls = JSON.parse(link.urls);

            // Get analytics summary
            const analytics = await DB.table("analytics")
                .where({ link_id: id })
                .select(
                    DB.raw('COUNT(*) as total_clicks'),
                    DB.raw('COUNT(DISTINCT ip_address) as unique_visitors')
                );

            return response.inertia("Links/Show", {
                user,
                link,
                analytics: analytics[0] || { total_clicks: 0, unique_visitors: 0 }
            });

        } catch (error) {
            console.error("Error loading link details:", error);
            return response.redirect("/links?error=Gagal memuat detail link");
        }
    }

    /**
     * Delete link
     */
    public async destroy(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({
                    error: "Unauthorized"
                });
            }

            const { id } = request.params;

            // Check if link exists and belongs to user
            const link = await DB.table("links")
                .where({ id, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }

            // Delete analytics first (foreign key constraint)
            await DB.table("analytics")
                .where({ link_id: id })
                .delete();

            // Delete link
            await DB.table("links")
                .where({ id })
                .delete();

            return response.json({
                success: true,
                message: "Link berhasil dihapus"
            });

        } catch (error) {
            console.error("Error deleting link:", error);
            return response.status(500).json({
                error: "Failed to delete link"
            });
        }
    }

    /**
     * Toggle link active/inactive status
     */
    public async toggle(request: Request, response: Response) {
        try {
            const user = request.user;
            if (!user) {
                return response.status(401).json({
                    error: "Unauthorized"
                });
            }

            const { id } = request.params;

            // Get link
            const link = await DB.table("links")
                .where({ id, user_id: user.id })
                .first();

            if (!link) {
                return response.status(404).json({
                    error: "Link not found"
                });
            }

            // Toggle status
            const newStatus = link.is_active ? 0 : 1;

            await DB.table("links")
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

        } catch (error) {
            console.error("Error toggling link status:", error);
            return response.status(500).json({
                error: "Failed to toggle link status"
            });
        }
    }

}

export default new LinkController();
