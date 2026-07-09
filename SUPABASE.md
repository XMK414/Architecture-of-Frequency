# Optional: Shared community backend (Supabase)

By default the site stores comments, archive submissions, and votes in each
visitor's **own browser** (`localStorage`). That's zero-setup and works
everywhere, but entries aren't shared between people.

To make the community sections **shared across all visitors**, connect a free
[Supabase](https://supabase.com) project. It takes about five minutes and
requires no server — the browser talks to Supabase directly, protected by
Row Level Security.

## 1. Create the project

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Once it's ready, open **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** key (a long `eyJ...` string — this key is meant to be public)

## 2. Create the tables

Open **SQL Editor** in Supabase, paste the following, and run it:

```sql
-- Comments -----------------------------------------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  genre      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Archive: moments / artists / tracks --------------------------------------
create table if not exists public.archive (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('moments','artists','tracks')),
  f1         text not null,
  f2         text,
  message    text not null,
  handle     text,
  votes      integer not null default 1,
  created_at timestamptz not null default now()
);

-- Atomic upvote (used by the site; falls back to read-modify-write if absent)
create or replace function public.increment_archive_vote(row_id uuid)
returns void language sql as $$
  update public.archive set votes = votes + 1 where id = row_id;
$$;

-- Row Level Security -------------------------------------------------------
alter table public.comments enable row level security;
alter table public.archive  enable row level security;

-- Anyone may read.
create policy "read comments" on public.comments for select using (true);
create policy "read archive"  on public.archive  for select using (true);

-- Anyone may submit.
create policy "insert comments" on public.comments for insert with check (true);
create policy "insert archive"  on public.archive  for insert with check (true);

-- Anyone may upvote (increment the votes column).
create policy "vote archive" on public.archive for update using (true) with check (true);
```

> These policies allow open, anonymous participation — appropriate for a public
> community wall. If you later want moderation or spam protection, tighten the
> insert/update policies or add a Supabase Edge Function.

### Optional: seed the starter entries

The repo ships with curated seed content that shows automatically in local
mode. To pre-populate your shared database with the same starters, you can
insert them manually in the SQL Editor, e.g.:

```sql
insert into public.archive (kind, f1, f2, message, handle, votes) values
  ('moments', 'Daft Punk''s US debut at Even Furthur', '1996',
   'Two unknown French producers play their first American show in the Wisconsin mud, booked by the Drop Bass Network.', 'FREQ/ARCH', 21),
  ('artists', 'Djrum', 'DnB / Techno / Modern Classical',
   'A turntablist and trained pianist collapsing jungle, techno, and film-score emotion into single tracks.', 'FREQ/ARCH', 12),
  ('tracks', 'Brown Paper Bag', 'Roni Size / Reprazent',
   'The live-bass DnB odyssey that won the 1997 Mercury Prize over Radiohead.', 'FREQ/ARCH', 14);
```

## 3. Wire it into the site

Open `js/config.js` and paste in your values:

```js
window.FREQARCH_CONFIG = {
    supabaseUrl: 'https://abcdefgh.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR...'
};
```

Commit and redeploy. The badges next to **The Living Archive** and
**Frequency Feedback** will switch from "Saved in your browser" to
"Shared · live", and submissions will now sync for everyone.

If the Supabase client can't load or the credentials are wrong, the site
**automatically falls back to localStorage** — it never breaks.
