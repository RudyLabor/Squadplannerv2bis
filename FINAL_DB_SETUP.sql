-- 1. Enable Realtime for Messages and Notifications
begin;
  -- Check if publication exists, otherwise create it (usually exists by default)
  -- This creates or updates the publication to include our tables
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table messages, notifications;
commit;

-- 2. Create Storage Bucket 'make-e884809f-uploads'
insert into storage.buckets (id, name, public)
values ('make-e884809f-uploads', 'make-e884809f-uploads', true)
on conflict (id) do nothing;

-- 3. Storage Policies (Allow public read, authenticated upload)
-- Read Policy
create policy "Give public access to clean-architecture-demo" 
on storage.objects for select 
using ( bucket_id = 'make-e884809f-uploads' );

-- Upload Policy (Authenticated users only)
create policy "Allow authenticated uploads" 
on storage.objects for insert 
with check ( bucket_id = 'make-e884809f-uploads' and auth.role() = 'authenticated' );

-- 4. Verify Messages Table Realtime Setup (Optional, just to be sure triggers aren't blocking)
alter table messages replica identity full;
alter table notifications replica identity full;
