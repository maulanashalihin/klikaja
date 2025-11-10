# 🗄️ KlikAja - Database Migration Summary

> **Status**: ✅ MVP Migrations Complete  
> **Date**: Nov 10, 2025  
> **Database**: SQLite (BetterSQLite3)

---

## ✅ Completed Migrations

### 1. **users** (Updated)
**File**: `20230513055909_users.ts`

**Purpose**: Store user accounts for authenticated features

**Columns**:
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `email` (String, Unique, Required)
- `password` (String, Hashed, Required)
- `phone` (String, Optional)
- `role` (Enum: admin, editor, viewer)
- `is_verified` (Boolean)
- `is_admin` (Boolean)
- `remember_me_token` (String, Optional)
- `membership_date` (DateTime, Optional)
- `created_at` (BigInt)
- `updated_at` (BigInt)

**Indexes**:
- `email` (for fast lookup)

---

### 2. **links** ⭐ Core Table
**File**: `20251110000001_create_links_table.ts`

**Purpose**: Store shortened links (supports anonymous + authenticated)

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, **NULLABLE** - for anonymous links)
- `alias` (String, Unique, Required) - The short code
- `urls` (Text/JSON) - Array of destination URLs for rotation
- `rotation_method` (Enum: random, sequential, weighted)
- `current_index` (Integer) - For sequential rotation
- `title` (String, Optional)
- `description` (Text, Optional)
- `password` (String, Hashed, Optional) - Password protection
- `expires_at` (BigInt, Optional) - Expiration timestamp
- `max_clicks` (Integer, Optional) - Click limit
- `click_count` (Integer, Default: 0)
- `is_active` (Boolean, Default: true)
- `is_claimed` (Boolean, Default: false) - For anonymous links
- `claim_token` (String, Unique, Optional) - For claiming
- `qr_code_path` (String, Optional) - QR code file path
- `created_at` (BigInt)
- `updated_at` (BigInt)

**Indexes**:
- `alias` ⚡ Most important - for fast redirects
- `user_id`
- `claim_token`
- `is_active`
- `created_at`

**Foreign Keys**:
- `user_id` → `users.id` (ON DELETE CASCADE)

---

### 3. **link_claims**
**File**: `20251110000002_create_link_claims_table.ts`

**Purpose**: Track claim tokens for anonymous links

**Columns**:
- `id` (UUID, Primary Key)
- `link_id` (UUID, Required)
- `claim_token` (String, Unique, Required)
- `expires_at` (BigInt, Required) - Token expiration
- `created_at` (BigInt)

**Indexes**:
- `claim_token` (for fast token lookup)
- `link_id`
- `expires_at` (for cleanup of expired tokens)

**Foreign Keys**:
- `link_id` → `links.id` (ON DELETE CASCADE)

---

### 4. **analytics** 📊
**File**: `20251110000003_create_analytics_table.ts`

**Purpose**: Track every click on shortened links

**Columns**:
- `id` (UUID, Primary Key)
- `link_id` (UUID, Required)
- `clicked_at` (BigInt, Required)
- `ip_address` (String, Optional) - IPv6 support
- `user_agent` (Text, Optional)
- `device_type` (Enum: mobile, desktop, tablet, bot, unknown)
- `browser` (String, Optional)
- `os` (String, Optional)
- `country` (String, Optional)
- `city` (String, Optional)
- `region` (String, Optional) - State/Province
- `referrer` (Text, Optional) - Full referrer URL
- `referrer_domain` (String, Optional) - Extracted domain
- `utm_source` (String, Optional)
- `utm_medium` (String, Optional)
- `utm_campaign` (String, Optional)
- `utm_term` (String, Optional)
- `utm_content` (String, Optional)

**Indexes**:
- `link_id` (group by link)
- `clicked_at` (time-based queries)
- `device_type`
- `country`
- `referrer_domain`
- `[link_id, clicked_at]` (composite for time-series)

**Foreign Keys**:
- `link_id` → `links.id` (ON DELETE CASCADE)

---

## 🎯 Database Schema Overview

```
users (1) ──────┐
                │
                │ (optional)
                ▼
links (1) ──────┼────────┐
                │        │
                │        │
                ▼        ▼
        link_claims  analytics
           (1:1)      (1:many)
```

### Relationships:
- **users → links**: One-to-Many (Optional - for anonymous links)
- **links → link_claims**: One-to-One (Only for anonymous links)
- **links → analytics**: One-to-Many (Every click tracked)

---

## 🔥 Key Features Enabled

### ✅ Anonymous Link Creation
- `user_id` is nullable in `links` table
- Links can be created without authentication
- `claim_token` generated for later claiming

### ✅ Link Claiming System
- `link_claims` table tracks claim tokens
- Tokens expire after set period
- After claim, `is_claimed` flag set to true
- `user_id` updated with claimer's ID

### ✅ Link Rotation
- `urls` field stores JSON array of multiple URLs
- `rotation_method` determines how to rotate
- `current_index` tracks position for sequential

### ✅ Analytics Tracking
- Every click recorded in `analytics` table
- Device, location, referrer tracked
- UTM parameters for campaign tracking
- Optimized indexes for fast queries

### ✅ Link Security
- Password protection support
- Expiration dates
- Max click limits
- Active/inactive status

---

## 📊 Performance Optimizations

### Critical Indexes:
1. **links.alias** - Most important! Used for every redirect
2. **analytics.link_id** - For analytics queries
3. **analytics.clicked_at** - For time-based reports
4. **link_claims.claim_token** - For claim validation

### Composite Indexes:
- **analytics.[link_id, clicked_at]** - For time-series analytics

---

## 🚀 Next Steps

### Week 1 Remaining:
- [ ] Create DB service wrapper
- [ ] Create seed data for testing
- [ ] Build AuthController
- [ ] Build LinkController (basic methods)

### Testing:
```bash
# Run migrations
npx knex migrate:latest

# Rollback (if needed)
npx knex migrate:rollback

# Check migration status
npx knex migrate:status

# View tables
sqlite3 dev.sqlite3 ".tables"

# View schema
sqlite3 dev.sqlite3 ".schema links"
```

---

## 📝 Migration Commands

### Run Migrations:
```bash
npx knex migrate:latest
```

### Rollback Last Batch:
```bash
npx knex migrate:rollback
```

### Rollback All:
```bash
npx knex migrate:rollback --all
```

### Check Status:
```bash
npx knex migrate:status
```

### Create New Migration:
```bash
npx knex migrate:make migration_name
```

---

## 🗄️ Database File Locations

- **Development**: `./dev.sqlite3`
- **Production**: `./production.sqlite3`
- **Migrations**: `./migrations/`

---

## ✅ Migration Checklist

- [x] Users table updated with role field
- [x] Links table created with all MVP features
- [x] Link_claims table created for claiming system
- [x] Analytics table created for tracking
- [x] All indexes created for performance
- [x] Foreign keys configured with CASCADE delete
- [x] Migrations tested and working

---

## 🎉 Status: Ready for Development!

Database schema is complete and ready for:
1. ✅ Anonymous link creation
2. ✅ Link claiming
3. ✅ User authentication
4. ✅ Analytics tracking
5. ✅ QR code generation
6. ✅ Link rotation
7. ✅ Password protection
8. ✅ Expiration & limits

**Next**: Build controllers and services! 🚀
