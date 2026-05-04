-- profiles: 사용자 추가 정보 테이블
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'counselor')),
  created_at timestamptz default now()
);

-- posts: 블로그 글 테이블
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null default 'general',
  title text not null,
  content text not null,
  created_at timestamptz default now()
);