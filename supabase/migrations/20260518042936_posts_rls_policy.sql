ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts: public read access" ON public.posts;
DROP POLICY IF EXISTS "posts: authenticated insert own post" ON public.posts;
DROP POLICY IF EXISTS "posts: authors can update own posts" ON public.posts;
DROP POLICY IF EXISTS "posts: authors can delete own posts" ON public.posts;

CREATE POLICY "posts: public read access"
ON public.posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "posts: authenticated insert own post"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts: authors can update own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts: authors can delete own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());