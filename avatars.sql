-- Create a storage bucket for user avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true);

-- Enable Row Level Security (RLS) for the storage.objects table
-- (usually enabled by default, but good to be sure)
-- alter table storage.objects enable row level security;

-- Policy to allow anyone to read avatars
create policy "Avatar images are publicly accessible." 
on storage.objects for select 
using ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar." 
on storage.objects for insert 
with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users to update their own avatar
create policy "Users can update their own avatar." 
on storage.objects for update 
with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users to delete their own avatar
create policy "Users can delete their own avatar."
on storage.objects for delete
using ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
