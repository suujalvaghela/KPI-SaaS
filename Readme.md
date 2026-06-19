# KPI Dashboard — Backend

> Real-time business metrics. Multi-tenant. Production-grade.

A SaaS backend where teams define custom KPIs, push live datapoints, and get email alerts the moment a threshold breaks — all within isolated workspaces with fine-grained access control and a Razorpay-powered freemium model.

---

## Stack

| **Runtime**    | Node.js + Express + TypeScript |
| **Database**   | PostgreSQL + Prisma ORM |
| **Real-time**  | Socket.io |
| **Queue**      | BullMQ + Redis |
| **Auth**       | Google OAuth 2.0 + JWT |
| **Payments**   | Razorpay |
| **Email**      | Nodemailer (Gmail SMTP) |
| **Validation** | Zod |
| **API Docs**   | Bruno Collections |

---

## What it does

**Custom Metrics** — Define any KPI (Revenue, Signups, Error Rate, etc.) per workspace and push values in real-time.

**Live Dashboard Updates** — Every datapoint triggers a Socket.io broadcast to the workspace room. Charts update without polling.

**Automated Alerts** — Set ABOVE/BELOW thresholds on any metric. When a value breaches the rule, a notification is created and an email goes out — without touching the API response time.

**Two-layer RBAC** — Global roles gate route access (e.g. only Admins can create workspaces). Workspace membership roles gate resource access (Creator vs Guest). Both layers enforced via middleware.

**Multi-tenancy** — Each workspace is fully isolated. Members, metrics, datapoints, thresholds, notifications, and subscriptions are all scoped.

**Freemium Payments** — Workspaces start on Free tier. The upgrade flow uses Razorpay with both a client-side verify endpoint (instant UX) and a server-to-server webhook (resilient backup). Both are idempotent.

---

## Architecture

### Database shape

```
Users
├── Roles → Policies (resource/action rules)
└── Workspaces
    ├── Memberships (user + role)
    ├── Metrics
    │   ├── Datapoints (time-series, cursor-paginated)
    │   └── Thresholds (alert rules)
    ├── Notifications
    └── Subscriptions
        └── PaymentEvents (audit trail)
```

### Datapoint → Alert pipeline

```
POST /datapoint
  → Save to DB
  → Socket.io emit to workspace room       ← live chart update
  → BullMQ job enqueued
      → Worker checks all thresholds
          → Breach? → Notification + Email
```

### Payment flow

```
POST /upgrade    → Razorpay order created
User pays
POST /verify     → Signature verified → workspace upgraded  (instant)
Webhook fires    → Server confirms    → workspace upgraded  (backup)
```

---

## API

### Auth
```
POST  /api/auth/google        Google OAuth login
GET   /api/auth/me            Current user
```

### Workspaces
```
POST    /api/workspace
GET     /api/workspace/:id
PATCH   /api/workspace/:id
DELETE  /api/workspace/:id
```

### Metrics
```
POST    /api/metric/workspace/:workspaceId
GET     /api/metric/workspace/:workspaceId
GET     /api/metric/:metricId
PATCH   /api/metric/:metricId
DELETE  /api/metric/:metricId
```

### Datapoints
```
POST    /api/datapoint/workspace/:workspaceId/metric/:metricId
GET     /api/datapoint/workspace/:workspaceId/metric/:metricId?cursor=&limit=
DELETE  /api/datapoint/workspace/:workspaceId/:datapointId
```

Pagination is cursor-based — stable under live inserts, no page drift.

### Thresholds
```
POST    /api/threshold/metric/:metricId
GET     /api/threshold/metric/:metricId
PATCH   /api/threshold/:thresholdId
DELETE  /api/threshold/:thresholdId
```

### Notifications
```
GET     /api/notification
PATCH   /api/notification/:id/read
DELETE  /api/notification/:id
```

### Payments
```
POST    /api/payment/upgrade/:workspaceId
POST    /api/payment/verify
POST    /api/payment/webhook
```

---

## Key decisions

**Immutable datapoints and notifications** — no update operations. Preserves audit trail integrity. Delete and recreate if correction is needed.

**BullMQ for threshold checks** — decouples alert logic from the request path. Alerts arrive ~1–5s after the datapoint, which is acceptable. Worker crashes don't affect the API.

**Cursor pagination over offset** — time-series data grows continuously. Offset-based pages drift as new rows arrive. Cursor-based pages don't.

**Two payment endpoints** — the verify endpoint gives users instant feedback if Razorpay's client-side callback fires. The webhook catches the case where the client crashes mid-flow. Both write the same upgrade — idempotent.

**Workspace-level subscriptions** — one workspace, one plan. All members share Pro tier. Matches standard SaaS freemium behaviour.

---

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis — `docker run -d -p 6379:6379 redis`
- Gmail account with an app password
- Razorpay test account

### Environment

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/kpi_dashboard

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=

REDIS_URL=redis://localhost:6379

SMTP_EMAIL=
SMTP_PASSWORD=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### Run

```bash
git clone <repo> && cd kpi-dashboard-backend
npm install
npx prisma migrate dev
npm run dev          # API server
npm run worker       # BullMQ threshold worker (separate terminal)
npm init
npx tsc --init
npx prisma init
npx prisma migrate dev 
npx prisma db push
docker run -d -p 6379:6379 redis
docker exec -it 27f1905fc87b redis-cli ping
```

### Test payments locally

```bash
ngrok http 3000
# Set https://<tunnel>.ngrok.io/api/payment/webhook in Razorpay dashboard
```

Razorpay test cards: `4111 1111 1111 1111` (success) · `4000 0000 0000 0002` (failure)

---

## Project structure

```
src/
├── config/           # DB, Redis, Razorpay clients
├── middlewares/      # Auth, validation, RBAC
├── modules/
│   ├── auth/
│   ├── user/
│   ├── workspace/
│   ├── metric/
│   ├── datapoint/
│   ├── threshold/
│   ├── notification/
│   ├── payment/
│   └── membership/
├── workers/          # BullMQ threshold checker
├── sockets/          # Socket.io handlers
├── utils/
└── app.ts
```

---

## Scaling notes

Socket.io rooms are per-workspace — handles ~10k concurrent connections before needing Redis adapter. BullMQ with a single Redis instance processes ~1k jobs/second. Cursor pagination stays efficient past millions of datapoints with a `(workspace_id, metric_id, timestamp)` index.

Straightforward next steps: Redis caching for hot metrics, hourly/daily datapoint rollups, rate limiting per workspace.

---

MIT