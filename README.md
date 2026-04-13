# Tweeter

An open-source, Twitter-style microblog MVP (posts, likes, follows) built with:

- Next.js (App Router)
- Supabase (Auth + Postgres)
- Vercel (deployment)

## Local setup

1) Install dependencies:

```bash
npm install
```

2) Configure Supabase:

- Follow `SUPABASE_SETUP.md`
- Create `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3) Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy to Vercel

1) Push this repo to GitHub.
2) In Vercel, **Add New → Project** and import the repo.
3) Set Environment Variables (same values as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4) In Supabase, add your production redirect URL:
   - `https://YOUR_VERCEL_DOMAIN/auth/callback`
5) Deploy.

## Notes

- `npm run build` uses webpack (`next build --webpack`) to avoid Turbopack issues in restricted environments.
- (Optional) If you want custom lingo, edit the UI copy in `src/`.
