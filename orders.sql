-- Create the orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    package_amount integer not null default 0,
    total_price numeric not null default 0,
    status varchar(50) not null default 'pending', -- pending, completed, cancelled
    items jsonb not null default '[]',
    customer_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policy: Users can view their own orders
create policy "Users can view their own orders"
on public.orders for select
using (auth.uid() = user_id);

-- Policy: Users can insert their own orders
create policy "Users can insert their own orders"
on public.orders for insert
with check (auth.uid() = user_id);

-- Note: Updating order status (e.g. pending -> completed) 
-- will be done via API routes using the service_role_key,
-- so we don't need to add a public update policy for users.
