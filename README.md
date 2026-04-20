# Commit — Habit Tracker

A full-stack habit tracking app that visualizes your daily progress using a GitHub-style contribution heatmap.

## Live Demo

[https://commit-internet-programming.vercel.app/login](https://commit-internet-programming.vercel.app/login)

## User Manual

### Account Access

- Log in with your email and password.
- If you do not have an account, click **Sign Up** on the login page.
- During sign-up, enter a username, email, password, and password confirmation.
- Passwords must be at least 8 characters long.

### Dashboard

- Open **Manage Habits** with the **+** button to add or remove habits.
- Use habit tabs to filter your logs and heatmap by a specific habit.
- Add a new log from the **Add Log** card:
   - Choose a habit from the dropdown.
   - Optionally add notes.
   - Click **Add Log**.
- On desktop, the **Add Log** card appears to the right of the heatmap. On smaller screens, it stacks below the heatmap.

### Visualization

- The **Your Logs** section displays a GitHub-style contribution heatmap.
- Brighter green squares represent days with more logged activity.
- Dashboard stats include:
   - **Total Logs** (or **Total [Habit] Logs** when filtered)
   - **Logs Per Week** (or **[Habit] Logs Per Week** when filtered)
   - **Most Logged Activity** (across all habits)
   - **Least Logged Activity** (across all habits)

### Profile

- Click **Profile** in the top-right navigation.
- The profile page shows:
   - Username
   - Email
   - Member Since
   - Total Logs

### Sign Out

- Click **Sign Out** in the top-right navigation.
- You will be returned to the login page.

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
