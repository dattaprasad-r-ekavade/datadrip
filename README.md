# DataDrip MVP

Marketing analytics platform foundation for agencies managing Meta and Google Ads accounts. Sprint 1 delivers the authenticated Next.js application shell with Prisma, magic-link authentication, and the admin-ready dashboard experience.

## Tech stack

- Next.js 15 (App Router) with TypeScript and Tailwind CSS v4
- Prisma ORM with SQLite for local development
- NextAuth v5 email-provider (magic link) authentication
- shadcn/ui component system + lucide-react icons
- Husky + lint-staged + Prettier + ESLint for code quality

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and fill in the secrets:
   ```bash
   cp .env.example .env.local
   ```
   Required variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `EMAIL_SERVER_HOST`
   - `EMAIL_SERVER_PORT`
   - `EMAIL_SERVER_USER`
   - `EMAIL_SERVER_PASSWORD`
   - `EMAIL_FROM`
3. Apply the initial Prisma migration (creates `prisma/dev.db`):
   ```bash
   npx prisma db execute --file prisma/migrations/0001_init/migration.sql
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Useful scripts

- `npm run dev` � start Next.js dev server
- `npm run build` � production build
- `npm run lint` � ESLint check
- `npm run typecheck` � TypeScript project check
- `npm run format` � Prettier formatting

## Project layout

- `app/` � App Router routes, grouped into public auth and protected dashboard areas
- `components/` � UI building blocks and authentication layout pieces
- `lib/` � Prisma client, environment parsing, auth utilities, navigation config
- `prisma/` � Prisma schema, migrations, local SQLite database
- `types/` � TypeScript module augmentation (e.g., NextAuth session typing)

## Authentication flow

- Users request a magic link on `/login`
- Email verification handled through NextAuth email provider
- Middleware guards protect `/dashboard` and `/admin` routes; super-admin enforcement is in place
- Server utilities in `lib/auth/session.ts` provide helpers for guarded server components

## Dashboard shell

- Responsive sidebar + top navigation using shadcn/ui `Sidebar`
- Placeholder metrics and tasks in `/dashboard`
- Admin panel starter page at `/admin` gated to super admins

---

For environment setup, API keys, and deployment considerations, refer to the docs in the `plan/` directory.
