# EDURA - Online Education Platform

Live Demo: https://course-xi-smoky.vercel.app (and https://course-6ovb0ye9k-chindigos-projects.vercel.app)

Online Education Feels Like Real Classroom — Built with Next.js 16, Tailwind CSS, Prisma, NextAuth, Vercel Blob.

## Features
- **User Authentication & Profiles**: Email/password (bcrypt), student dashboards, profile management. Demo: `student@edura.com / Student123!` and `admin@edura.com / Admin123!`
- **Course Catalog & Search**: Browse, filter by category/level/price, search, detailed landing pages
- **Course Content Player**: Video (YouTube embed + upload via Vercel Blob), resources (PDFs), quizzes, progress tracker
- **Payment Gateway (Manual Proof)**: Admin uploads account info in `/admin` -> Payment Accounts. Students at checkout see admin accounts, transfer offline, upload receipt image (Vercel Blob). Admin reviews in `/admin` -> Payments -> Approve/Reject -> auto-enrollment
- **Community & Engagement**: Discussion forums under lessons, comments
- **Instructor/Admin Dashboard**: Upload courses/lessons/resources, manage enrollments, track sales/analytics, issue certificates (mock)
- **Mobile Responsive & PWA**: Tailwind responsive, `manifest.json`, optimized for mobile

## Design Reference
Edura template (blue #0166FF, hero with floating badges, stats bar, category grid, course cards) — replicated in `components/edura/*`

## Tech Stack
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- Auth: NextAuth v4 Credentials + bcryptjs
- DB: Prisma + Vercel Postgres (Neon) — fallback to in-memory mock when `DATABASE_URL` not set (demo mode)
- Storage: Vercel Blob for payment proofs, thumbnails, videos, PDFs (fallback to local preview if no token)
- i18n: Simple context with `en` default + switcher for `am`, `fr`, `ar` (English, Amharic, French, Arabic)
- Deployment: Vercel (Build: `prisma generate && next build`)

## Quick Start Local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local # fill DATABASE_URL, NEXTAUTH_SECRET, BLOB_READ_WRITE_TOKEN
npx prisma generate
npx prisma db push
npx prisma db seed # or npm run db:seed
npm run dev
```

Open http://localhost:3000

## Env Vars (.env.example)
```
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="32+ chars"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
```

For demo without DB/Blob, leave empty — app uses mock data and memory store (resets on redeploy).

## Vercel Deploy
Already deployed via token `vcp_...` (rotate after). Project `course` under `chindigos-projects`.

To redeploy:
```bash
vercel --prod --token $VERCEL_TOKEN
```

Create Vercel Postgres (Neon) via Dashboard: Storage -> Create Postgres -> connect to `course` -> auto-injects `DATABASE_URL`.
Then set env:
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add BLOB_READ_WRITE_TOKEN
```

After adding DB, run `prisma db push` and `prisma db seed` via `vercel --prod` will auto-run `prisma generate`.

## Admin Workflow for Payment Proofs
1. Login as admin@edura.com / Admin123! -> /admin
2. Go to Payment Accounts -> Create account (e.g., CBE 1000123456789)
3. Student checks out /checkout/[courseId] -> sees accounts -> uploads proof
4. Admin -> Payments -> View image -> Approve -> student gets enrollment in /dashboard and access to /learn/[courseId]

## Language
Default `en`. Switch via top bar selector (stores in localStorage). Add translations in `lib/i18n.ts:1`

---
Built for Vercel. Template reference: Edura Online Education screenshot.
