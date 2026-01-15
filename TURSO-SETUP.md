# Turso Database Setup

## Option 1: Using Turso CLI (Recommended)

1. Install Turso CLI (if not already installed):
```bash
# Windows
powershell -c "irm https://get.tur.so/install.ps1 | iex"

# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

2. Login to Turso:
```bash
turso auth login
```

3. Apply migrations:
```bash
# Set database URL
turso db shell datadrip-justforfreecopilot < prisma/migrations/0001_init/migration.sql
turso db shell datadrip-justforfreecopilot < prisma/migrations/20260108162310_add_invitations_and_pricing_tier/migration.sql
```

4. Seed the database:
```bash
npx tsx scripts/setup-turso.ts
```

## Option 2: Manual SQL Execution

1. Go to [Turso Dashboard](https://turso.tech/app)
2. Select your database: `datadrip-justforfreecopilot`
3. Open the SQL editor
4. Copy and paste the contents of `prisma/migrations/0001_init/migration.sql`
5. Execute
6. Then copy and paste `prisma/migrations/20260108162310_add_invitations_and_pricing_tier/migration.sql`
7. Execute
8. Run the seed script:
```bash
npx tsx scripts/setup-turso.ts
```

## Demo Credentials

After seeding, you can login with:
- **Agency Admin**: `demo@datadrip.io` / `demo123`
- **Super Admin**: `admin@datadrip.io` / `demo123`

## Troubleshooting

If you get "table already exists" errors, the tables are already created. Just run the seed script:
```bash
npx tsx scripts/setup-turso.ts
```

If the database has data already, you can reset it via Turso Dashboard or CLI and start over.
