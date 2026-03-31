# Commit — Habit Tracker

A full-stack habit tracking app that visualizes your daily progress using a GitHub-style contribution heatmap.

## Live Demo

[https://commit-internet-programming.vercel.app/login](https://commit-internet-programming.vercel.app/login)

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Supabase** — authentication & PostgreSQL database
- **Tailwind CSS** — styling
- **react-calendar-heatmap** — contribution-style calendar
- **react-tooltip** — heatmap hover tooltips
- **bible-api.com** — free daily Bible verse

## Features

- Sign up / Log in with Supabase Auth
- Create and remove custom habits (with color coding)
- Add logs for **today only** (enforced client + server + DB constraint)
- GitHub-style heatmap calendar filtered by habit or all logs
- Stats: total logs, logs/week, most & least logged activity
- Daily Bible verse
- Profile page

## Getting Started

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in **Supabase SQL Editor**:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql` and execute it

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── actions/          # Server actions (auth, habits, logs)
├── home/             # Main dashboard page
├── login/            # Login page
├── signup/           # Sign-up page
└── profile/          # Profile page
components/
├── Navbar.tsx
├── BibleVerse.tsx
├── HabitTabs.tsx
├── HabitManager.tsx
├── HeatmapCalendar.tsx
├── StatsCards.tsx
├── AddLogForm.tsx
└── HomeClient.tsx
lib/
├── supabase/         # Supabase client & server helpers
└── types.ts
supabase/
└── migrations/       # SQL schema
```
