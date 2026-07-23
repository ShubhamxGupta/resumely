# Database & Persistence Specification — Resumely

## 1. Overview & Schema Design

Resumely uses **Supabase PostgreSQL** as its persistence backend. Authentication and user table isolation are managed via Supabase Auth and Row Level Security (RLS).

---

## 2. Table Schema: `public.analyses`

```sql
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  filename text not null,
  ats_score numeric default 0,
  keyword_match numeric default 0,
  missing_keywords jsonb default '[]'::jsonb,
  analysis_result jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.analyses enable row level security;

-- Service Role Policy
create policy "Allow all operations for service role"
  on public.analyses
  for all
  using (true)
  with check (true);
```
