-- Drop tables if they exist (for easy resetting/seeding)
drop table if exists astro_cards;
drop table if exists orders;
drop table if exists customers;
drop table if exists admin_allowlist;

-- 1. Create Customers Table
create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  dob date,
  birth_time time,
  birth_place text,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  country text not null default 'India',
  zodiac_sign text,
  birth_star text,
  created_at timestamptz not null default now()
);

-- 2. Create Orders Table
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references customers(id),
  product_name text not null default 'Sarvamanghala Rakshai',
  quantity int not null default 1,
  additional_astro_cards int not null default 0,
  product_amount numeric(10,2) not null,
  astro_card_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  order_status text not null default 'pending'
    check (order_status in ('pending','processing','shipped','delivered','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create Astro Cards Table
create table astro_cards (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  is_free boolean not null default true,
  full_name text,
  dob date,
  birth_time time,
  birth_place text,
  zodiac_sign text,
  birth_star text,
  status text not null default 'pending'
    check (status in ('pending','in_progress','prepared','sent','completed')),
  created_at timestamptz not null default now()
);

-- 4. Create Admin Allowlist Table
create table admin_allowlist (
  email text primary key
);

-- Enable Row Level Security (RLS) on all tables
alter table customers enable row level security;
alter table orders enable row level security;
alter table astro_cards enable row level security;
alter table admin_allowlist enable row level security;

-- Since all database calls go through Next.js server route handlers using the service role key,
-- they automatically bypass RLS. For safety, we do not define any public RLS policies, 
-- ensuring no client can directly read/write tables.

-- Seed default allowlisted admin email
-- (The developer/client can add their actual email here in Supabase dashboard)
insert into admin_allowlist (email) values ('sarvamanghalarakshai@gmail.com');
