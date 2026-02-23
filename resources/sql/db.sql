-- 0. Drop existing tables and its dependencies
DROP TABLE IF EXISTS public.registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create a simple events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  location text
);

-- 2. Profiles table to store roles and names
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  avatar_url TEXT,
  preferred_lang TEXT DEFAULT 'en',
  contact_number TEXT
);

-- 3. Registrations (The link between Users and Events)
CREATE TABLE public.registrations (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'attended')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id) 
);

-- 4. Enable RLS (Should be on by default, but this ensures it)
alter table public.events enable row level security;
alter table public.profiles enable row level security;
alter table public.registrations enable row level security;

-- 5. Policies
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view registrations" ON public.registrations FOR SELECT USING (true);
CREATE POLICY "Users can sign themselves up" ON public.registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel their sign up" ON public.registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can check themselves in" ON public.registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 7. Policy: Users can view any profile (necessary for the "Attendee Grid" later)
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- 8. Policy: Users can only update their OWN profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 9. Create a function that Supabase will run on every signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_lang, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'en', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Set up the trigger to run the function after a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Backfill: If you already have users in Auth but Profiles is empty, run this:
INSERT INTO public.profiles (id, role, preferred_lang)
SELECT id, 'user', 'en' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 12. Remove the old 'allow everyone' policy
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;

-- 13. Create (or Re-create) the strict Admin policy
CREATE POLICY "Admins can insert events" 
ON public.events 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 3. Update or Delete Events for Admin only
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

-- Allow admins to Update/Delete events
CREATE POLICY "Admins can update events" 
ON public.events FOR UPDATE TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete events" 
ON public.events FOR DELETE TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));