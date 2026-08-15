create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null check (price > 0),
  material text,
  dimensions text,
  category text not null default 'Scarves',
  images text[] not null default '{}',
  inventory integer not null default 0 check (inventory >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Regular products are fixed-price by category: Scarves $100, Purses $50.
update public.products set category = 'Scarves' where category not in ('Scarves', 'Purses');
update public.products set price = 100 where category = 'Scarves' and price is distinct from 100;
update public.products set price = 50 where category = 'Purses' and price is distinct from 50;

alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check check (category in ('Scarves', 'Purses'));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  customer_email text,
  customer_phone text,
  total numeric(10,2) not null default 0,
  status text not null default 'pending',
  shipping_address jsonb,
  shipped_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists shipped_at timestamptz;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

create table if not exists public.bespoke_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  budget text,
  colors text,
  occasion text,
  description text not null,
  inspiration_url text,
  status text not null default 'pending_payment',
  type text not null default 'scarf',
  price numeric(10,2),
  stripe_session_id text unique,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

alter table public.bespoke_requests add column if not exists type text not null default 'scarf';
alter table public.bespoke_requests add column if not exists price numeric(10,2);
alter table public.bespoke_requests add column if not exists stripe_session_id text unique;
alter table public.bespoke_requests add column if not exists shipping_address jsonb;
alter table public.bespoke_requests alter column status set default 'pending_payment';

alter table public.bespoke_requests drop constraint if exists bespoke_requests_type_check;
alter table public.bespoke_requests add constraint bespoke_requests_type_check check (type in ('scarf', 'purse', 'set'));

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.bespoke_requests enable row level security;

drop policy if exists "public can view active products" on public.products;
create policy "public can view active products"
on public.products for select
to anon, authenticated
using (is_active = true);

drop policy if exists "customers can view their own orders" on public.orders;
create policy "customers can view their own orders"
on public.orders for select
to authenticated
using (customer_email = (select auth.jwt()->>'email'));

drop policy if exists "customers can view their own order items" on public.order_items;
create policy "customers can view their own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.customer_email = (select auth.jwt()->>'email')
  )
);

create or replace function public.decrement_inventory(
  p_product_id uuid,
  p_quantity integer
)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set inventory = inventory - p_quantity
  where id = p_product_id
    and inventory >= p_quantity;

  if not found then
    raise exception 'Insufficient inventory for product %', p_product_id;
  end if;
end;
$$;

revoke all on function public.decrement_inventory(uuid, integer) from public, anon, authenticated;
grant execute on function public.decrement_inventory(uuid, integer) to service_role;
