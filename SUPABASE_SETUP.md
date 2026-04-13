# Supabase setup (Tweeter)

## 1) Create a Supabase project

- Create a new project in Supabase.
- Go to **Project Settings → API** and copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Enable email + password auth

In Supabase:
- **Authentication → Providers → Email**
  - Ensure Email auth is enabled
  - Ensure **password sign-in** is allowed

## 3) Apply the database schema + RLS

- Open **SQL Editor** in Supabase.
- Paste and run `supabase/migrations/0001_init.sql`.

## 4) Configure auth redirect URLs

In Supabase:
- **Authentication → URL Configuration**
  - Add Redirect URL: `http://localhost:3000/auth/callback`
  - After deploying on Vercel, add: `https://YOUR_DOMAIN/auth/callback`
