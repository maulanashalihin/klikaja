# 🚀 KlikAja - Smart Link Shortener

> **KlikAja** - Satu klik, semua terhubung. Link yang lebih cerdas, lebih cepat, dan lebih terukur.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🎯 Tentang KlikAja

**KlikAja** adalah platform link shortener generasi baru yang menggabungkan kesederhanaan dengan kekuatan analytics mendalam. Dirancang untuk marketer, developer, dan bisnis yang membutuhkan lebih dari sekadar memendekkan URL.

### 🌟 Mengapa KlikAja?

- **⚡ Cepat & Responsif** - Dibangun dengan HyperExpress untuk performa maksimal
- **📊 Analytics Mendalam** - Real-time tracking dengan visualisasi interaktif
- **🎨 Modern UI/UX** - Interface yang intuitif dengan Svelte 5 & TailwindCSS
- **🔒 Aman & Reliable** - Password protection, expiration dates, dan link monitoring
- **🤝 Team Collaboration** - Workspace sharing dengan role-based permissions
- **🌍 Global Ready** - Geographic tracking dan multi-language support

---

## 🎨 Branding Guidelines

### Logo & Identity
- **Primary Color**: `#FF6B35` (Vibrant Orange) - Energi, aksi, dan kecepatan klik
- **Secondary Color**: `#004E89` (Deep Blue) - Kepercayaan, profesional, dan stabilitas
- **Accent Color**: `#00D9FF` (Bright Cyan) - Modern, tech-forward, dan inovasi
- **Neutral Dark**: `#1A1A2E` (Dark Navy) - Elegance dan kontras
- **Neutral Light**: `#F8F9FA` (Off White) - Clean dan readable

### Color Usage
- **Primary (Orange)**: CTA buttons, links, active states, brand highlights
- **Secondary (Blue)**: Headers, navigation, trust elements
- **Accent (Cyan)**: Hover states, notifications, success animations
- **Dark**: Text, backgrounds (dark mode)
- **Light**: Backgrounds, cards (light mode)

### Typography
- **Heading**: Inter Bold / 700
- **Subheading**: Inter SemiBold / 600
- **Body**: Inter Regular / 400
- **Monospace**: JetBrains Mono (untuk short links & code)

### Voice & Tone
- Energik namun profesional
- Direct dan action-oriented
- Fokus pada efisiensi dan hasil cepat
- Menggunakan bahasa yang jelas dan persuasif
- Friendly tapi tetap trustworthy

---

## ✨ Fitur Utama

### 1. 🔗 Smart Link Shortening
- **No Login Required** - Buat link tanpa perlu registrasi atau login
- **Instant Link Generation** - Hasil langsung muncul di halaman baru
- **Link Claiming** - Klaim link anonymous untuk masuk ke dashboard (perlu login/register)
- **Auto-ownership** - Link otomatis tersimpan jika user sudah login saat membuat
- **Multi-URL Input** - Perpendek hingga 10 URL sekaligus
- **Custom Alias Generator** - AI-powered suggestions berdasarkan konten URL
- **Real-time Validation** - Instant feedback untuk ketersediaan alias
- **QR Code Generator** - Automatic QR code untuk setiap link
- **Link Rotation** - Random, sequential, atau weighted rotation untuk multiple URLs
- **UTM Parameter Builder** - Integrated campaign tracking

### 2. 📈 Advanced Analytics Dashboard
- **Real-time Statistics** - Live click counter dengan animated numbers
- **Interactive Charts** - Click-through rates dengan ECharts.js
- **Geographic Heat Map** - World map dengan zoom dan drill-down
- **Device Analytics** - Breakdown device, browser, dan OS
- **Referrer Tracking** - Top referrers dengan click counts
- **Time-based Filtering** - Custom date range analytics
- **Export Functionality** - Download sebagai PDF atau CSV

### 3. 🎯 Custom Alias Management
- **Alias Library** - Grid view dengan search dan filter
- **Smart Categories** - Auto-categorization (social, business, personal)
- **Bulk Operations** - Batch editing untuk multiple aliases
- **Link Status Monitor** - Real-time status checking
- **Expiration Scheduler** - Custom expiration dates
- **Password Protection** - Secure sensitive links
- **Link Editing** - Modify destination tanpa mengubah short link

### 4. 📁 Link Organization
- **Folder System** - Organize by project/campaign
- **Tag System** - Multiple tags untuk advanced filtering
- **Favorite Links** - Star untuk quick access
- **Recent Activity** - Timeline of changes
- **Bulk Import/Export** - Migrate dari services lain
- **Link Templates** - Pre-configured settings

### 5. 👥 Team Collaboration
- **Shared Workspaces** - Team link management
- **Role-based Permissions** - Admin, Editor, Viewer roles
- **Activity Logs** - Track semua perubahan
- **Comment System** - Notes pada specific links
- **Approval Workflows** - Review process untuk certain links

### 6. 🎨 Link Preview & Branding
- **Open Graph Preview** - Custom OG image, title, description untuk social media
- **Preview Card Generator** - Lihat bagaimana link tampil di berbagai platform
- **Branded Short Domains** - Connect custom domain (e.g., go.brandname.com)
- **Link Preview Customization** - Edit meta tags untuk optimal sharing

### 7. 🛡️ Link Health & Security
- **Link Health Monitoring** - Periodic check status destination URL (200, 404, 500)
- **Broken Link Detection** - Auto-alert jika link broken
- **Link Safety Scanning** - Scan untuk malware/phishing
- **Auto-pause Broken Links** - Prevent bad user experience
- **SSL Certificate Monitoring** - Track SSL expiration

### 8. 🚀 Advanced Routing & Personalization
- **Dynamic Link Routing** - Redirect berdasarkan:
  - Time of day (morning vs evening offers)
  - Day of week (weekend vs weekday)
  - User location/language
  - Device type (mobile vs desktop)
- **A/B Testing** - Split traffic untuk test different destinations
- **Conditional Redirects** - Rules-based routing

### 9. 📊 Conversion & Performance
- **Conversion Tracking** - Track goals (purchases, signups, downloads)
- **Conversion Funnel** - Visualize user journey
- **Link Performance Score** - Score berdasarkan CTR, engagement, conversion
- **ROI Calculator** - Calculate campaign ROI
- **Automated Reports** - Weekly/monthly email reports

### 10. 🎯 Link Collections & Campaigns
- **Campaign Management** - Group multiple links into campaigns
- **Campaign Analytics** - Aggregate stats untuk entire campaign
- **Link Templates** - Save configurations as reusable templates
- **Bulk Link Creation** - Create multiple links at once
- **Campaign Sharing** - Share entire collection dengan single URL

### 11. 🔌 Integrations & Extensions
- **Browser Extension** - Chrome/Firefox extension untuk quick shortening
- **API Access** - RESTful API untuk integrations
- **Webhooks** - Real-time notifications untuk events
- **Zapier Integration** - Connect dengan 5000+ apps
- **Retargeting Pixels** - Facebook Pixel, Google Ads integration

---

## 🛠️ Tech Stack

### Backend
- **[HyperExpress](https://github.com/kartikk221/hyper-express)** - High-performance web server
- **[Knex.js](https://knexjs.org)** - SQL query builder
- **[BetterSQLite3](https://github.com/WiseLibs/better-sqlite3)** - Fast SQLite database
- **[Nodemailer](https://nodemailer.com/)** - Email notifications
- **[Redis](https://redis.io/)** - Caching layer (optional)
- **[Squirrelly](https://squirrelly.js.org/)** - Template engine

### Frontend
- **[Svelte 5](https://svelte.dev)** - Reactive UI framework
- **[Inertia.js](https://inertiajs.com)** - SPA without API
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS
- **[ECharts](https://echarts.apache.org/)** - Interactive charts
- **[Anime.js](https://animejs.com/)** - Smooth animations
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm atau yarn
- SQLite3

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/klikaja.git
cd klikaja

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npx knex migrate:latest

# Start development server
npm run dev
```

### Environment Variables

```env
# Application
APP_NAME=KlikAja
APP_URL=http://localhost:3000
APP_PORT=3000

# Database
DB_CONNECTION=sqlite
DB_DATABASE=./database/klikaja.db

# Redis (Optional)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

# Analytics
ENABLE_ANALYTICS=true
ANALYTICS_RETENTION_DAYS=365
```

---

## 🚀 Usage

### Basic Link Shortening

```javascript
// Via API
POST /api/shorten
{
  "urls": ["https://example.com/very-long-url"],
  "alias": "my-link", // optional
  "rotation": "random" // random, sequential, weighted
}
```

### Multiple URLs with Rotation

```javascript
POST /api/shorten
{
  "urls": [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
  ],
  "alias": "promo",
  "rotation": "random",
  "advanced": {
    "password": "secret123",
    "expiresAt": "2024-12-31",
    "maxClicks": 1000
  }
}
```

### Analytics Query

```javascript
GET /api/analytics/:alias?from=2024-01-01&to=2024-12-31
```

---

## 📊 Project Structure

```
klikaja/
├── app/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Custom middleware
│   └── services/         # Business logic
├── resources/
│   ├── views/           # Squirrelly templates
│   └── js/
│       ├── Pages/       # Svelte pages
│       ├── Components/  # Reusable components
│       ├── app.js       # Inertia entry point
│       └── index.css    # TailwindCSS styles
├── routes/
│   ├── web.ts          # Web routes
│   └── api.ts          # API routes
├── migrations/          # Database migrations
├── public/             # Static assets
├── dist/               # Compiled assets
└── database/           # SQLite database
```

---

## 🎨 UI/UX Features

### Interactive Components
- **Smooth Animations** - Anime.js powered transitions
- **Real-time Updates** - SSE for live statistics
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - System preference detection
- **Accessibility** - WCAG 2.1 AA compliant

### User Flows

#### Anonymous Quick Shorten Flow (No Login)
1. Visit homepage
2. Paste long URL
3. Auto-generated alias suggestions appear
4. Customize alias (optional)
5. Click "Shorten"
6. Redirect to result page with:
   - Short link with copy button
   - QR code
   - Basic analytics preview
   - "Claim this link" button (prompts login/register)

#### Logged-in Quick Shorten Flow
1. Paste long URL (from homepage or dashboard)
2. Auto-generated suggestions appear
3. Select or customize alias
4. One-click shorten
5. Link automatically saved to dashboard
6. QR code auto-generated
7. Redirect to link details page

#### Link Claiming Flow
1. User creates link without login
2. User clicks "Claim this link" on result page
3. Redirect to login/register page
4. After successful auth, link ownership transferred
5. Link appears in user's dashboard
6. Full analytics and management available

#### Advanced Creation Flow (Logged-in Only)
1. Toggle advanced options
2. Add multiple URLs
3. Configure rotation method
4. Set expiration & password
5. Add UTM parameters
6. Organize with folders/tags
7. Share with team

---

## 🔒 Security Features

- **Password Protection** - Secure sensitive links
- **Expiration Dates** - Auto-expire old links
- **Rate Limiting** - Prevent abuse
- **CSRF Protection** - Secure form submissions
- **XSS Prevention** - Sanitized inputs
- **SQL Injection Protection** - Parameterized queries

---

## 📈 Performance

- **Sub-100ms Response Time** - HyperExpress optimization
- **Efficient Caching** - Redis integration
- **Database Indexing** - Optimized queries
- **Asset Optimization** - Vite bundling
- **CDN Ready** - Static asset delivery

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [HyperExpress](https://github.com/kartikk221/hyper-express) - Amazing web framework
- [Svelte](https://svelte.dev) - Reactive UI framework
- [Inertia.js](https://inertiajs.com) - Modern monolith approach
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS

---

## 📧 Contact & Support

- **Website**: [klikaja.app](https://klikaja.app)
- **Email**: support@klikaja.app
- **Twitter**: [@klikajaapp](https://twitter.com/klikajaapp)
- **Discord**: [Join our community](https://discord.gg/klikaja)

---

<div align="center">
  <p>Made with ❤️ by the KlikAja Team</p>
  <p>
    <a href="https://klikaja.app">Website</a> •
    <a href="https://docs.klikaja.app">Documentation</a> •
    <a href="https://github.com/yourusername/klikaja/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/klikaja/issues">Request Feature</a>
  </p>
</div>