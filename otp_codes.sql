-- Create the otp_codes table
create table public.otp_codes (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  verified boolean default false not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.otp_codes enable row level security;

-- Create policy to allow only authenticated access from the server using the service role key
create policy "Enable all access for service role only" on public.otp_codes
  for all
  using (auth.jwt() ->> 'role' = 'service_role');
