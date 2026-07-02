# G-Scores — 2024 High School Exam Scores

A full-stack web application to look up individual exam results and explore
national score statistics from the Vietnamese 2024 High School Exam
(~1.06 million candidates).

Built for the [Golden Owl](https://goldenowl.asia) Web Developer Intern
assignment. The original brief is preserved in [ASSIGNMENT.md](./ASSIGNMENT.md).

> **Live demo:** https://gscores-frontend-4emh.onrender.com
> _(hosted on Render free tier — the first request may take ~30–60s to wake the service)._
>
> **Walkthrough video:** https://drive.google.com/drive/folders/1rs4hZgzT5x9XUYxbWi9Mbc140wsrqLcK?usp=sharing
> _(architecture overview + app demo, with voice-over — built with [Remotion](https://www.remotion.dev/), a popular React framework for making videos in code)._

![UI mockup](./screenshots/mockup-ui.png)

---

## Features

**Must-have (all implemented)**
- **Data import** — the raw CSV (`dataset/diem_thi_thpt_2024.csv`) is loaded into
  PostgreSQL via a coded **migration** (table structure) + **seeder** (streamed
  batch import of 1M+ rows). Nothing is imported by hand.
- **Score lookup** — search a candidate's detailed scores by registration
  number (số báo danh), with per-subject level classification.
- **Reports** — a bar chart of the number of candidates in each of the 4 levels
  (`>= 8`, `6–8`, `4–6`, `< 4`) **per subject**.
- **Top 10** — the top 10 Group A students (Math + Physics + Chemistry).

**Nice-to-have (all implemented)**
- **Responsive** design (desktop / tablet / mobile).
- **Docker** — the whole stack runs with a single `docker compose up`.
- **Deployment** — ready-to-deploy config (see below).

---

## Tech Stack

| Layer     | Technology                                                      |
| --------- | -------------------------------------------------------------- |
| Frontend  | React 18 + TypeScript + Vite, React Router, Recharts, Axios    |
| Backend   | Node.js + Express + TypeScript, layered architecture           |
| ORM / DB  | Prisma ORM + PostgreSQL 16                                     |
| DevOps    | Docker + Docker Compose, nginx (static frontend)              |

The subject domain is modelled with **OOP** (`Subject` / `SubjectRegistry`
classes) as required, and used as the single source of truth for lookup,
statistics and grouping. Input is validated on both client and server.

---

## Project Structure

```
.
├── backend/                # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma    # DB schema (model Score)
│   │   ├── migrations/      # generated SQL migrations
│   │   └── seed.ts          # streamed CSV -> DB importer
│   └── src/
│       ├── domain/          # OOP: Subject, SubjectRegistry, ScoreLevel
│       ├── repositories/    # Prisma queries
│       ├── services/        # business logic
│       ├── controllers/     # request handlers
│       ├── routes/          # API routes
│       ├── validators/      # input validation
│       └── middleware/      # error handling
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── pages/           # Dashboard, SearchScores, Reports, Settings
│       ├── components/      # Layout, Sidebar
│       ├── api/             # axios client
│       └── lib/             # level labels/colours
├── dataset/                # raw CSV (source data)
├── docker-compose.yml      # db + backend + frontend
└── .env.example            # copy to .env
```

---

## Quick Start with Docker (recommended)

The only prerequisite is **Docker Desktop**.

```bash
cp .env.example .env
docker compose up -d --build
```

This starts three containers:

| Service  | URL                          | Notes                                  |
| -------- | ---------------------------- | -------------------------------------- |
| frontend | http://localhost:8080        | the app                                |
| backend  | http://localhost:4000/api    | REST API                               |
| db       | localhost:5433 → 5432        | PostgreSQL (host port 5433)            |

On first start the backend automatically **runs migrations** and **seeds** the
database from the CSV (~1–2 minutes for 1M+ rows). The seeder skips
automatically on later starts; set `FORCE_SEED=1` to re-import.

Open **http://localhost:8080** and try registration number `01000001`.

Stop everything with `docker compose down` (add `-v` to also delete the data).

> **Note on port 5433:** the DB is published on host port **5433** instead of the
> default 5432 to avoid clashing with a locally-installed PostgreSQL. Adjust
> `POSTGRES_PORT` in `.env` if needed.

---

## Local Development (without Docker for the apps)

Requires **Node.js 20+** and a PostgreSQL instance. The simplest option is to
run just the database in Docker:

```bash
cp .env.example .env
docker compose up -d db          # Postgres on localhost:5433
```

**Backend** (terminal 1):

```bash
cd backend
npm install
npx prisma migrate deploy         # create tables
npm run seed                      # import CSV (~2 min, first time only)
npm run dev                       # http://localhost:4000
```

**Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

---

## API Reference

Base URL: `http://localhost:4000/api`

| Method | Endpoint                   | Description                                        |
| ------ | -------------------------- | ------------------------------------------------- |
| GET    | `/health`                  | Health check                                      |
| GET    | `/scores/:sbd`             | Scores + levels for a candidate. `400` if the sbd is invalid, `404` if not found |
| GET    | `/reports/statistics`      | Per-subject counts across the 4 levels (chart data) |
| GET    | `/reports/top-group-a`     | Top 10 Group A students (Math + Physics + Chemistry) |

Example:

```bash
curl http://localhost:4000/api/scores/01000001
```

---

## Database Schema

A single `scores` table (one row per candidate). Subject score columns are
nullable because candidates only sit a subset of subjects.

| Column         | Type        | Notes                        |
| -------------- | ----------- | ---------------------------- |
| `sbd`          | varchar     | registration number, unique  |
| `toan` … `gdcd`| float, null | the 9 subject scores         |
| `ma_ngoai_ngu` | varchar     | foreign-language code        |

Indexes on `toan`, `vat_li`, `hoa_hoc` speed up the Group A ranking.

The 4 score levels: `>= 8` (Excellent), `6–8` (Good), `4–6` (Average),
`< 4` (Poor).

---

## Deployment

The app is container-ready and can be deployed to any Docker-capable host
(Render, Fly.io, Railway, a VPS, …). A [render.yaml](./render.yaml) blueprint is
included for [Render](https://render.com):

1. Push this repo to GitHub.
2. On Render: **New → Blueprint**, select the repo. It provisions a PostgreSQL
   database, the backend (Docker) and the frontend (static site).
3. After the DB is ready, seed it once from the backend shell:
   `node dist/prisma/seed.js` (or set it as a one-off job).
4. Set the frontend `VITE_API_URL` to the deployed backend URL and redeploy.

Then update the **Demo** link at the top of this README.

---

## Scripts

**Backend** (`cd backend`)

| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | dev server with reload             |
| `npm run build`           | compile TypeScript                 |
| `npm start`               | run compiled server                |
| `npm run seed`            | import CSV into DB                  |
| `npx prisma migrate deploy` | apply migrations                 |
| `npx prisma studio`       | browse the DB in the browser       |

**Frontend** (`cd frontend`)

| Script            | Description            |
| ----------------- | ---------------------- |
| `npm run dev`     | Vite dev server        |
| `npm run build`   | production build       |
| `npm run preview` | preview the build      |
