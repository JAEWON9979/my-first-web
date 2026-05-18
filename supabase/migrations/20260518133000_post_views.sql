-- post_views: 게시글 조회 로그 테이블
create table if not exists public.post_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz not null default now()
);

create index if not exists post_views_post_id_idx
  on public.post_views (post_id);

create index if not exists post_views_viewed_at_idx
  on public.post_views (viewed_at desc);

alter table public.post_views enable row level security;

drop policy if exists "post_views: public read access" on public.post_views;
drop policy if exists "post_views: public insert access" on public.post_views;

create policy "post_views: public read access"
on public.post_views
for select
to public
using (true);

create policy "post_views: public insert access"
on public.post_views
for insert
to public
with check (true);
