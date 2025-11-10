"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("../services/View");
class Controller {
    async index(request, response) {
        return response.inertia("Home/Index");
    }
    async about(request, response) {
        return response.send((0, View_1.view)("about.html"));
    }
    async features(request, response) {
        return response.send((0, View_1.view)("features.html"));
    }
    async pricing(request, response) {
        return response.send((0, View_1.view)("pricing.html"));
    }
    async privacy(request, response) {
        return response.send((0, View_1.view)("privacy.html"));
    }
    async terms(request, response) {
        return response.send((0, View_1.view)("terms.html"));
    }
    async contact(request, response) {
        return response.send((0, View_1.view)("contact.html"));
    }
    async sitemap(request, response) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage - Highest Priority -->
  <url>
    <loc>https://klikaja.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>https://klikaja.app/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Features Page -->
  <url>
    <loc>https://klikaja.app/features</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Pricing Page -->
  <url>
    <loc>https://klikaja.app/pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Contact Page -->
  <url>
    <loc>https://klikaja.app/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Privacy Policy -->
  <url>
    <loc>https://klikaja.app/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Terms of Service -->
  <url>
    <loc>https://klikaja.app/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Login Page -->
  <url>
    <loc>https://klikaja.app/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Register Page -->
  <url>
    <loc>https://klikaja.app/register</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>`;
        response.header("Content-Type", "application/xml");
        return response.send(sitemap);
    }
    async robots(request, response) {
        const robots = `# robots.txt for KlikAja - Smart Link Shortener
# https://klikaja.app

User-agent: *
Allow: /
Allow: /about
Allow: /features
Allow: /pricing
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /login
Allow: /register

# Disallow private/authenticated pages
Disallow: /dashboard
Disallow: /links/
Disallow: /analytics/
Disallow: /claim/
Disallow: /api/

# Disallow admin areas
Disallow: /admin/

# Allow CSS and JS for better crawling
Allow: /dist/*.css
Allow: /dist/*.js
Allow: /public/*.css
Allow: /public/*.js

# Sitemap location
Sitemap: https://klikaja.app/sitemap.xml

# Crawl-delay (be nice to server)
Crawl-delay: 1`;
        response.header("Content-Type", "text/plain");
        return response.send(robots);
    }
}
exports.default = new Controller();
//# sourceMappingURL=HomeController.js.map