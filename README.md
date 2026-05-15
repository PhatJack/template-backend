# template-backend

Lightweight TypeScript REST API template using Express, MySQL, and Prisma.

**Prerequisites:**
- Node.js (16+ recommended)
- A package manager: `pnpm` (recommended) or `npm`
- MySQL if you plan to use a database (see `.env.example`)

**Quick start**

1. Install dependencies

```bash
# with pnpm (recommended)
pnpm install

# or with npm
npm install
```

2. Configure environment

```bash
# copy example env and edit values as needed
cp .env.example .env
# (on Windows PowerShell) Copy-Item .env.example .env
```

- Set `DATABASE_URL` in `.env` to your MySQL connection string.
- Run `pnpm run prisma:migrate` to create/update the database tables in development.

3. Run the app

```bash
# Development (auto-restarts with tsx)
pnpm run dev
# or
npm run dev

# Build
pnpm run build
# or
npm run build

# Production (runs compiled dist/server.js)
pnpm start
# or
npm start
```

**API docs**
- Swagger UI: `http://localhost:3000/api-docs`
- Swagger UI alias: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

**Available scripts** (from `package.json`)
- `dev`: Start development server with `tsx watch src/server.ts`
- `build`: Generate Prisma Client and compile TypeScript into `dist`
- `prisma:generate`: Generate Prisma Client
- `prisma:migrate`: Run Prisma migrations in development
- `start`: Run `node dist/server.js`

**Database notes**
- Example environment settings are in `.env.example`.
- To use MySQL locally quickly you can run:

```bash
docker run -d -p 3306:3306 --name template-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=template_backend mysql:8
```

**Where to look**
- Server entry: `src/server.ts`
- App setup: `src/app.ts`
- Prisma schema: `prisma/schema.prisma`
- Routes: `src/routes` and controllers in `src/controllers`
