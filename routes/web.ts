import AuthController from "../app/controllers/AuthController"; 
import Auth from "../app/middlewares/auth"
import HomeController from "../app/controllers/HomeController";
import LinkController from "../app/controllers/LinkController";
import AnalyticsController from "../app/controllers/AnalyticsController";
import SettingsController from "../app/controllers/SettingsController";
import FolderController from "../app/controllers/FolderController";
import TagController from "../app/controllers/TagController";
import AssetController from "../app/controllers/AssetController";
import S3Controller from "../app/controllers/S3Controller";
import HyperExpress from 'hyper-express';

const Route = new HyperExpress.Router();

/**
 * Public Routes
 * These routes are accessible without authentication
 * ------------------------------------------------
 * GET  / - Home page
 */
Route.get("/", HomeController.index);

/**
 * SEO Routes
 * Routes for search engine optimization
 * ------------------------------------------------
 * GET  /sitemap.xml - XML sitemap for search engines
 * GET  /robots.txt - Robots.txt for crawler instructions
 */
Route.get("/sitemap.xml", HomeController.sitemap);
Route.get("/robots.txt", HomeController.robots);

/**
 * SEO-Friendly Static Pages
 * Crawlable HTML pages for better SEO
 * ------------------------------------------------
 * GET  /about - About us page
 * GET  /features - Features showcase
 * GET  /pricing - Pricing information
 * GET  /privacy - Privacy policy
 * GET  /terms - Terms of service
 * GET  /contact - Contact page
 */
Route.get("/about", HomeController.about);
Route.get("/features", HomeController.features);
Route.get("/pricing", HomeController.pricing);
Route.get("/privacy", HomeController.privacy);
Route.get("/terms", HomeController.terms);
Route.get("/contact", HomeController.contact);

/**
 * Link Shortening Routes (Public)
 * Routes for anonymous link creation and viewing
 * ------------------------------------------------
 * POST /shorten - Create anonymous short link
 * GET  /result/:claim_token - View result page for anonymous link
 * GET  /claim/:claim_token - Claim anonymous link (requires auth)
 * GET  /api/alias/check/:alias - Check alias availability (AJAX)
 */
Route.post("/shorten", LinkController.storeAnonymous);
Route.get("/result/:claim_token", LinkController.showResult);
Route.get("/claim/:claim_token", LinkController.claimLink);
Route.get("/api/alias/check/:alias", LinkController.checkAlias);

/**
 * Link Management Routes (Authenticated)
 * Routes for managing user's links
 * ------------------------------------------------
 * GET    /links - List all user's links
 * GET    /links/create - Show create link form
 * POST   /links - Store new link
 * GET    /links/:id - Show single link details
 * GET    /links/:id/edit - Show edit link form
 * PUT    /links/:id - Update link
 * DELETE /links/:id - Delete link
 * POST   /links/:id/toggle - Toggle link active/inactive
 */
Route.get("/links", [Auth], LinkController.index);
Route.get("/links/create", [Auth], LinkController.create);
Route.post("/links", [Auth], LinkController.store);
Route.get("/links/:id/edit", [Auth], LinkController.edit);
Route.put("/links/:id", [Auth], LinkController.update);
Route.get("/links/:id", [Auth], LinkController.show);
Route.delete("/links/:id", [Auth], LinkController.destroy);
Route.post("/links/:id/toggle", [Auth], LinkController.toggle);

/**
 * Analytics Routes (Authenticated)
 * Routes for viewing link analytics
 * ------------------------------------------------
 * GET  /analytics - Main analytics dashboard
 * GET  /analytics/:alias - Single link analytics
 * GET  /analytics/:alias/export - Export analytics data (CSV)
 */
Route.get("/analytics", [Auth], AnalyticsController.index);
Route.get("/analytics/:alias", [Auth], AnalyticsController.show);
Route.get("/analytics/:alias/export", [Auth], AnalyticsController.export);

/**
 * Settings Routes (Authenticated)
 * Routes for user settings
 * ------------------------------------------------
 * GET  /settings - Show settings page
 * GET  /api/settings - Get user settings
 * POST /api/settings - Save settings
 */
Route.get("/settings", [Auth], SettingsController.index);
Route.get("/api/settings", [Auth], SettingsController.get);
Route.post("/api/settings", [Auth], SettingsController.store);

/**
 * Folders Routes (Authenticated)
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * ------------------------------------------------
 * GET    /api/folders - List all user's folders
 * POST   /api/folders - Create new folder
 * PUT    /api/folders/:id - Update folder
 * DELETE /api/folders/:id - Delete folder
 * POST   /api/folders/:id/move-links - Move links to folder
 * POST   /api/folders/reorder - Reorder folders
 */
Route.get("/api/folders", [Auth], FolderController.index);
Route.post("/api/folders", [Auth], FolderController.store);
Route.put("/api/folders/:id", [Auth], FolderController.update);
Route.delete("/api/folders/:id", [Auth], FolderController.destroy);
Route.post("/api/folders/:id/move-links", [Auth], FolderController.moveLinks);
Route.post("/api/folders/reorder", [Auth], FolderController.reorder);

/**
 * Tags Routes (Authenticated)
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * ------------------------------------------------
 * GET    /api/tags - List all user's tags
 * POST   /api/tags - Create new tag
 * PUT    /api/tags/:id - Update tag
 * DELETE /api/tags/:id - Delete tag
 * GET    /api/links/:linkId/tags - Get tags for a link
 * POST   /api/links/:linkId/tags - Attach tags to link
 * DELETE /api/links/:linkId/tags - Detach tags from link
 */
Route.get("/api/tags", [Auth], TagController.index);
Route.post("/api/tags", [Auth], TagController.store);
Route.put("/api/tags/:id", [Auth], TagController.update);
Route.delete("/api/tags/:id", [Auth], TagController.destroy);
Route.get("/api/links/:linkId/tags", [Auth], TagController.getForLink);
Route.post("/api/links/:linkId/tags", [Auth], TagController.attachToLink);
Route.delete("/api/links/:linkId/tags", [Auth], TagController.detachFromLink);

/**
 * S3 Routes
 * Routes for handling S3 operations
 * ------------------------------------------------
 * POST /api/s3/signed-url - Generate signed URL for file upload
 * POST /api/s3/product-image-url - Generate signed URL for product images
 * GET  /api/s3/public-url/:fileKey - Get public URL for existing file
 * GET  /api/s3/health - S3 service health check
 */
Route.post("/api/s3/signed-url", [Auth], S3Controller.getSignedUrl); 
Route.get("/api/s3/public-url/:fileKey", S3Controller.getPublicUrl);
Route.get("/api/s3/health", S3Controller.health);
/**
 * Authentication Routes
 * Routes for handling user authentication
 * ------------------------------------------------
 * GET   /login - Login page
 * POST  /login - Process login
 * GET   /register - Registration page
 * POST  /register - Process registration
 * POST  /logout - Logout user
 * GET   /google/redirect - Google OAuth redirect
 * GET   /google/callback - Google OAuth callback
 */
Route.get("/login", AuthController.loginPage);
Route.post("/login", AuthController.processLogin);
Route.get("/register", AuthController.registerPage);
Route.post("/register", AuthController.processRegister);
Route.post("/logout", AuthController.logout);
Route.get("/google/redirect", AuthController.redirect);
Route.get("/google/callback", AuthController.googleCallback);

/**
 * Password Reset Routes
 * Routes for handling password reset
 * ------------------------------------------------
 * GET   /forgot-password - Forgot password page
 * POST  /forgot-password - Send reset password link
 * GET   /reset-password/:id - Reset password page
 * POST  /reset-password - Process password reset
 */
Route.get("/forgot-password", AuthController.forgotPasswordPage);
Route.post("/forgot-password", AuthController.sendResetPassword);
Route.get("/reset-password/:id", AuthController.resetPasswordPage);
Route.post("/reset-password", AuthController.resetPassword);

/**
 * Protected Routes
 * These routes require authentication
 * ------------------------------------------------
 * GET   /home - User dashboard
 * GET   /profile - User profile
 * POST  /change-profile - Update profile
 * POST  /change-password - Change password
 * DELETE /users - Delete users (admin only)
 */
Route.get("/home", [Auth], AuthController.homePage);
Route.get("/profile", [Auth], AuthController.profilePage);
Route.post("/change-profile", [Auth], AuthController.changeProfile);
Route.post("/change-password", [Auth], AuthController.changePassword);
Route.delete("/users", [Auth], AuthController.deleteUsers);

/**
 * Static Asset Handling Routes
 * 
 * 1. Dist Assets (/assets/:file)
 * Serves compiled and bundled assets from the dist/assets directory
 * - Handles JavaScript files (*.js) with proper content type
 * - Handles CSS files (*.css) with proper content type
 * - Implements in-memory caching for better performance
 * - Sets long-term browser cache headers (1 year)
 * Example URLs:
 * - /assets/app.1234abc.js
 * - /assets/main.5678def.css
 */
Route.get("/assets/:file", AssetController.distFolder);

/**
 * 2. Public Assets (/*) - Catch-all Route
 * Serves static files from the public directory
 * - Must be the LAST route in the file
 * - Only serves files with allowed extensions
 * - Returns 404 for paths without extensions
 * - Implements security checks against unauthorized access
 * 
 * Allowed file types:
 * - Images: .ico, .png, .jpeg, .jpg, .gif, .svg
 * - Documents: .txt, .pdf
 * - Fonts: .woff, .woff2, .ttf, .eot
 * - Media: .mp4, .webm, .mp3, .wav
 * - Web: .css, .js
 * 
 * Example URLs:
 * - /images/logo.png
 * - /documents/terms.pdf
 * - /fonts/roboto.woff2
 */
Route.get("/public/*", AssetController.publicFolder);

/**
 * Short Link Redirect Route
 * MUST be after public assets route
 * ------------------------------------------------
 * GET /:alias - Redirect to destination URL
 */
Route.get("/:alias", LinkController.redirect);

export default Route;