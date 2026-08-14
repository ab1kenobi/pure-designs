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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  customer_email text,
  total numeric(10,2) not null default 0,
  status text not null default 'pending',
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

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
  status text not null default 'new',
  created_at timestamptz not null default now()
);

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
