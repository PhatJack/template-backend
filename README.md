# template-backend

Lightweight TypeScript REST API template using Express and MongoDB.

**Prerequisites:**

- Node.js (16+ recommended)
- A package manager: `pnpm` (recommended) or `npm`
- MongoDB if you plan to use a database (see `.env.example`)

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

- Set `MONGODB_URI` in `.env` to your MongoDB connection string.

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
- `build`: Compile TypeScript into `dist`
- `start`: Run `node dist/server.js`

**Database notes**

- Example environment settings are in `.env.example`.
- To use MongoDB locally quickly you can run:
