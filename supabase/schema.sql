create extension if not exists "pgcrypto";

create table if not exists public.task_columns (
  id text primary key,
  title text not null check (char_length(title) between 2 and 80),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.task_columns (id, title, position)
values
  ('todo', 'К выполнению', 1),
  ('in_progress', 'В работе', 2),
  ('done', 'Готово', 3)
on conflict (id) do nothing;

create index if not exists task_columns_position_idx on public.task_columns(position);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_priority_idx on public.tasks(priority);
create index if not exists tasks_created_at_idx on public.tasks(created_at desc);

alter table public.task_columns enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Public demo read columns" on public.task_columns;
create policy "Public demo read columns"
  on public.task_columns for select
  using (true);

drop policy if exists "Public demo insert columns" on public.task_columns;
create policy "Public demo insert columns"
  on public.task_columns for insert
  with check (true);

drop policy if exists "Public demo update columns" on public.task_columns;
create policy "Public demo update columns"
  on public.task_columns for update
  using (true)
  with check (true);

drop policy if exists "Public demo delete columns" on public.task_columns;
create policy "Public demo delete columns"
  on public.task_columns for delete
  using (true);

drop policy if exists "Public demo read access" on public.tasks;
create policy "Public demo read access"
  on public.tasks for select
  using (true);

drop policy if exists "Public demo insert access" on public.tasks;
create policy "Public demo insert access"
  on public.tasks for insert
  with check (true);

drop policy if exists "Public demo update access" on public.tasks;
create policy "Public demo update access"
  on public.tasks for update
  using (true)
  with check (true);

drop policy if exists "Public demo delete access" on public.tasks;
create policy "Public demo delete access"
  on public.tasks for delete
  using (true);
