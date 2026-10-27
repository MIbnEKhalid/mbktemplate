# MBKTech Node.js Template Application

Production-ready, battle-tested starter template for building services and web applications within the **MBKTech** ecosystem.

Designed for instant developer onboarding, zero configuration overhead, high security, and seamless compatibility with existing MBKTech platforms.

---

## Key Features

- **ES Modules (`"type": "module"`) & Express 5.x**: Modern JavaScript standard with top-level await and native async routing.
- **Centralized Authentication (`mbkauthe`)**:
  - Preconfigured session management, CSRF mitigation, and security cookies.
  - Granular RBAC permission guards with `sessPerm(...)`.
  - Automatic synchronization with the central ecosystem catalog via `npm run sync_permissions`.
- **Ecosystem Utilities (`mbkutils`)**:
  - Unified view engine integrating both app views and `mbkauthe` auth pages.
  - Standardized JSON responses (`sendSuccess`, `sendError`) and Handlebars rendering (`renderPage`).
  - Rate limiting with `createRateLimiter` and unified 404/error handling.
- **Dual Database Architecture (SQLite & PostgreSQL)**:
  - Zero-config local development using fast embedded SQLite (`better-sqlite3`).
  - Scalable production deployment on PostgreSQL (Neon / Supabase / self-hosted).
  - Clean repository abstraction with `BaseRepository`.
- **Security & Bot Protection**:
  - Hardened security headers (anti-clickjacking, XSS filter, nosniff, referrer policy).
  - Automated blocking of vulnerability scanners (`sqlmap`, `nikto`, `masscan`, etc.).
  - Distinguishes human traffic from social crawlers (`discordbot`, `twitterbot`, etc.).
- **Theme & Modern UI**:
  - Responsive design system with dark and light themes, CSS variables, and zero CSS runtime dependencies.
- **Instant Scaffolding CLI**:
  - Includes `create-app.mjs` to generate an entirely new customized app in one command.

---

## Directory Layout

```
├── .env.example              # Environment variables template
├── package.json              # App scripts and dependencies
├── vercel.json               # Vercel serverless deployment config
├── vitest.config.js          # Vitest testing configuration
├── scripts/
│   ├── initDb.js             # Dual-mode DB initializer (postgres / sqlite)
│   └── sync_permissions.js  # Catalog sync script (invoked by root init.mjs)
├── src/
│   ├── server.js             # HTTP server entrypoint
│   ├── app.js                # Express app setup and middleware pipeline
│   ├── permissions.js        # RBAC and permission manifest declaration
│   ├── config/
│   │   ├── env.js            # Dotenv and runtime configurations
│   │   └── view-engine.js    # Multi-engine Handlebars setup
│   ├── db/
│   │   ├── connection.js     # Pool and connection test helpers
│   │   ├── index.js          # Database adapter export
│   │   └── schema/
│   │       ├── init.js       # Schema runner with applySchema
│   │       ├── postgres.sql  # PostgreSQL DDL
│   │       └── sqlite.sql    # SQLite DDL
│   ├── controllers/          # Request handlers
│   │   ├── web.controller.js # Home and dashboard page rendering
│   │   ├── api.controller.js # REST API handlers
│   │   └── admin.controller.js# Admin panel handlers
│   ├── middleware/           # Middlewares
│   │   ├── security-headers.js
│   │   ├── bot-protection.js
│   │   ├── compression.js
│   │   ├── rate-limiter.js
│   │   ├── response-time.js
│   │   └── error-handler.js
│   ├── repositories/         # Database persistence queries
│   │   └── item.repository.js# BaseRepository implementation
│   ├── routes/               # Modular Express routing
│   │   ├── index.js          # Route hub (mounts mbkauthe + sub-routers)
│   │   ├── web.routes.js     # Public and protected web pages
│   │   ├── api.routes.js     # REST endpoints
│   │   └── admin.routes.js   # Admin routes with sessPerm
│   └── services/             # Business logic layer
│       └── item.service.js
├── views/                    # Handlebars templates
│   ├── layouts/
│   │   └── layout.hbs        # Master layout with theme and auth badge
│   ├── index.hbs             # Landing page
│   ├── dashboard.hbs         # Authenticated dashboard
│   ├── admin.hbs             # Protected admin panel
│   └── error.hbs             # Standard error view
├── public/                   # Static public assets
│   ├── assets/css/style.css  # Core design system
│   ├── assets/js/theme.js    # Theme switcher
│   └── assets/images/icon.svg# Vector logo
└── tests/
    ├── setup.js              # Vitest test bootstrap
    └── app.test.js           # Smoke & integration tests
```

---

## Quick Start

### 1. Generating a New Project via Scaffolder
From the repository root (`d:\mbktech`), run:

```bash
node create-app.mjs <app-name> --port=3090 --title="My New Application"
```

This will automatically create a new directory with customized ports, `.env`, permissions manifest, and package names.

### 2. Manual Setup
If you want to use this template directory directly:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Initialize the database schema (SQLite by default)
npm run db:init:sqlite
# Or for PostgreSQL:
# npm run db:init:postgres

# 4. Sync declared permissions with mbkauthe
npm run sync_permissions

# 5. Start the development server (with watch mode)
npm run dev
```

Visit [http://localhost:3080](http://localhost:3080) in your browser.

---

## Declaring & Syncing Permissions

Permissions and roles are defined in [`src/permissions.js`](src/permissions.js):

```javascript
import { definePermissions, syncAppPermissions } from "mbkauthe";

const MANIFEST = {
  items: {
    create: "Create new items",
    read: "Read and list items",
    delete: "Delete items",
  },
  admin: {
    view: "Access administrative area",
  },
};

const ROLES = {
  admin: {
    label: "Administrator",
    permissions: ["items:*", "admin:*"],
  },
};

export const Permissions = definePermissions(MANIFEST, {
  fallbackAppKey: "mbktemplate",
  roles: ROLES,
});
```

To sync changes to the central database catalog:
```bash
npm run sync_permissions
```
*(Also executed automatically across all ecosystem applications by root `init.mjs`!)*

### Protecting Routes
Use `sessPerm` from `mbkauthe` in your route files:

```javascript
import { Router } from "express";
import { sessPerm } from "mbkauthe";
import { Permissions } from "../permissions.js";

const router = Router();

// Protect a page or API endpoint
router.get("/dashboard", sessPerm(Permissions.items.read), controller.renderDashboard);
router.post("/api/items", sessPerm(Permissions.items.create), controller.createItem);
```

---

## Standard Responses with `mbkutils`

### JSON APIs
```javascript
import { sendSuccess, sendError } from "mbkutils";

// Standard JSON success envelope
return sendSuccess(res, { item }, { req, message: "Item created successfully" });

// Standard JSON error envelope
return sendError(res, error, { req, statusCode: 400 });
```

### HTML Rendering
```javascript
import { renderPage, getUserContext } from "mbkutils";

const userContext = getUserContext(req);
return renderPage(req, res, "dashboard.hbs", "layout", {
  title: "Dashboard",
  userContext,
  data
});
```

---

## Running Tests

Execute the unit and integration test suite:

```bash
npm test
```
