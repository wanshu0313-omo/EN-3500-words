-- 在你自己的 Supabase 项目 → SQL Editor 中运行。可重复运行，不删除学习记录。
create table if not exists public.ielts_reviews (
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 id uuid not null,
 word_id integer not null check (word_id between 1 and 3500),
 rating text not null check (rating in ('again','hard','good')),
 at bigint not null check (at > 0),
 primary key (user_id,id)
);
create index if not exists ielts_reviews_user_time on public.ielts_reviews(user_id,at,id);
create table if not exists public.ielts_preferences (
 user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
 target integer not null default 100 check (target between 20 and 150)
);
alter table public.ielts_reviews enable row level security;
alter table public.ielts_preferences enable row level security;
revoke all on public.ielts_reviews from anon, authenticated;
revoke all on public.ielts_preferences from anon, authenticated;
grant select, insert on public.ielts_reviews to authenticated;
grant select, insert, update on public.ielts_preferences to authenticated;
drop policy if exists own_reviews_read on public.ielts_reviews;
create policy own_reviews_read on public.ielts_reviews for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists own_reviews_insert on public.ielts_reviews;
create policy own_reviews_insert on public.ielts_reviews for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists own_preferences_read on public.ielts_preferences;
create policy own_preferences_read on public.ielts_preferences for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists own_preferences_insert on public.ielts_preferences;
create policy own_preferences_insert on public.ielts_preferences for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists own_preferences_update on public.ielts_preferences;
create policy own_preferences_update on public.ielts_preferences for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
