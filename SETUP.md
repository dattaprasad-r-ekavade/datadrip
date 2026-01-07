# DataDrip MVP - Development Setup

## Sprint 1 Complete ✅

Basic authentication and project structure implemented.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and generate a NextAuth secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Set Up Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Create Test User

```bash
npx tsx scripts/create-user.ts
```

This creates a test user:

- Email: `admin@test.com`
- Password: `password123`
- Role: Super Admin

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000/login

## Project Structure

- `/app` - Next.js app router pages
  - `/(auth)` - Login pages
  - `/(protected)` - Protected dashboard & admin pages
  - `/api/auth` - NextAuth API routes
- `/components` - React components
  - `/auth` - Authentication components
  - `/layout` - Layout components
  - `/ui` - shadcn/ui components
- `/lib` - Utility functions
  - `/auth` - Authentication helpers
- `/prisma` - Database schema & migrations
- `/scripts` - Development scripts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth v5 (Credentials Provider)
- **Database**: SQLite (dev) / MySQL (prod)
- **ORM**: Prisma
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Next Steps

See [plan/dev-task.md](plan/dev-task.md) for the complete development roadmap.

Sprint 2 will implement:

- Agency & Client Management
- Team Member Invitations
- Form Validation
- Admin Panel Foundation
