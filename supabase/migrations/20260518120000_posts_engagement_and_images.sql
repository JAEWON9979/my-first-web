-- posts: image_url 컬럼 추가
alter table public.posts
add column if not exists image_url text;

-- likes: 게시글 좋아요 테이블
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists likes_user_id_idx
  on public.likes (user_id);

-- comments: 게시글 댓글 테이블
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_post_id_created_at_idx
  on public.comments (post_id, created_at desc);

create index if not exists comments_user_id_idx
  on public.comments (user_id);

-- RLS: likes
alter table public.likes enable row level security;

drop policy if exists "likes: public read access" on public.likes;
drop policy if exists "likes: authenticated insert own like" on public.likes;
drop policy if exists "likes: authenticated delete own like" on public.likes;

create policy "likes: public read access"
on public.likes
for select
to public
using (true);

create policy "likes: authenticated insert own like"
on public.likes
for insert
to authenticated
with check (user_id = auth.uid());

create policy "likes: authenticated delete own like"
on public.likes
for delete
to authenticated
using (user_id = auth.uid());

-- RLS: comments
alter table public.comments enable row level security;

drop policy if exists "comments: public read access" on public.comments;
drop policy if exists "comments: authenticated insert own comment" on public.comments;
drop policy if exists "comments: authors can update own comments" on public.comments;
drop policy if exists "comments: authors can delete own comments" on public.comments;

create policy "comments: public read access"
on public.comments
for select
to public
using (true);

create policy "comments: authenticated insert own comment"
on public.comments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "comments: authors can update own comments"
on public.comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "comments: authors can delete own comments"
on public.comments
for delete
to authenticated
using (user_id = auth.uid());

-- Storage: 작은 이미지 전용 버킷 생성
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS: 공개 읽기, 로그인 사용자만 업로드
drop policy if exists "post-images: public read access" on storage.objects;
drop policy if exists "post-images: authenticated upload" on storage.objects;

create policy "post-images: public read access"
on storage.objects
for select
to public
using (bucket_id = 'post-images');

create policy "post-images: authenticated upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'post-images');