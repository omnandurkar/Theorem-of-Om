# Environment Variable Template

Create a local `.env` file from these names when running outside the managed workspace. Never commit the completed file, its database URL, or either secret.

```dotenv
# Server-only Supabase PostgreSQL transaction pooler for application runtime.
# Use port 6543. URL-encode special password characters, for example @ as %40.
SUPABASE_DATABASE_URL=postgresql://postgres.PROJECT_REF:URL_ENCODED_DATABASE_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true

# Server-only Supabase PostgreSQL session pooler for Drizzle migrations.
# Use port 5432.
SUPABASE_DIRECT_URL=postgresql://postgres.PROJECT_REF:URL_ENCODED_DATABASE_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres

# New high-entropy server-only signer for curator sessions.
JWT_SECRET=replace-with-a-new-long-random-secret

# First deployment only: seeds Om's initial curator password hash.
CURATOR_GATE_PASSWORD=replace-with-a-strong-private-curator-password
```

For Vercel, add the same four names in **Project Settings → Environment Variables** rather than creating a committed `.env` file. `SUPABASE_DIRECT_URL` is needed for migrations, while `SUPABASE_DATABASE_URL` is used by the deployed application.
