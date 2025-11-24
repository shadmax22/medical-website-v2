# HCL Health Platform Monorepo

This repository hosts the full-stack health-coaching platform, including APIs, dashboards, and a marketing site. Each app lives at the repo root to keep concerns separated while still sharing a single toolchain and issue tracker.

## Repository Layout

```
.
├── backend/          # Fastify + Prisma API (auth, doctors, patients, goals)
├── frontend/         # React + Vite dashboard for admins, doctors, and patients
├── landing/          # Marketing/landing Next.js site
├── screenshots/      # Product screenshots used in docs or presentations
├── package-lock.json # Root lockfile (mostly unused, app-specific locks live inside each app)
└── README.md         # You are here
```

### Backend (`backend/`)

| Path/Script            | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `src/server.ts`        | Fastify entrypoint registering public/private/admin routes plus doctor APIs. |
| `src/controllers/`     | Auth, doctor, patient, tracking, and dashboard endpoints.                    |
| `src/routes/`          | Route definitions grouped by audience (public/private/doctor/admin).         |
| `prisma/schema.prisma` | SQLite data model (`User`, `Doctor`, `Goal`, `GoalTracking`, etc.).          |
| `prisma/seed.ts`       | Generates 1 admin, 5 doctors, 15 patients, goals and progress entries.       |
| `package.json`         | Node scripts (build/start/dev), Fastify + Prisma dependencies.               |

**Common commands**

```bash
cd backend
npm install               # first time setup
npx prisma db push        # sync schema to dev SQLite
npx prisma db seed        # populate admin/doctors/patients/goals
npm run dev               # start Fastify server on localhost:3000
```

Environment variables live in `backend/.env` (copy `.env.example` if provided) and are consumed both by Fastify and Prisma.

### Frontend (`frontend/`)

| Path/Script                      | Description                                                       |
| -------------------------------- | ----------------------------------------------------------------- |
| `src/pages/dashboard/*`          | Role-specific dashboards (admin, doctor, patient).                |
| `src/components/`                | Shared UI such as patient profiles, modals, and stateful widgets. |
| `src/services/`                  | Axios API clients (`auth`, `patient`, `doctor`, `admin`).         |
| `src/layouts/dashboard.tsx`      | Shell used after login (sidebar, header, outlet).                 |
| `vite.config.ts`, `package.json` | Vite + React configuration and scripts.                           |

**Common commands**

```bash
cd frontend
npm install          # install React/Vite deps
npm run dev          # start Vite dev server (defaults to http://localhost:5173)
npm run build        # type-safe production build
```

Frontend expects the backend to be running on `http://localhost:3000` (configured in `src/utils/Axios.ts`). Adjust or add a `.env` file if you expose a different API URL.

### Landing (`landing/`)

Marketing site implemented with Next.js + Tailwind. Useful commands:

```bash
cd landing
npm install
npm run dev
```

The site consumes static content from `landing/markdown` and assets under `landing/public/images`.

## Getting Started

1. **Clone & install** — run `npm install` inside `backend`, `frontend`, and `landing`.
2. **Configure environment** — copy `.env.example` (if present) in each app and fill secrets such as `DATABASE_URL` or JWT keys.
3. **Prepare the database** — inside `backend`, run `npx prisma db push` followed by `npx prisma db seed`.
4. **Start services**:
   - API: `npm run dev` from `backend`
   - Dashboard: `npm run dev` from `frontend`
   - Landing page (optional): `npm run dev` from `landing`

## Additional Notes

- **Screenshots** are purely referential and not required for builds.
- **Naming**: folders were renamed to `backend` and `frontend` for clarity; update any local scripts referencing the old names (`backend-2`, `frontend-with-ts`) before running automation.
- **Monorepo tooling**: there is no root-level build pipeline; each app manages its own ESLint/TSConfig/lockfile.

Feel free to extend this README as new services or shared packages are introduced. Happy hacking!
