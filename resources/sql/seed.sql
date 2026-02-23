-- Clean up existing test data (optional)
truncate table public.events;

-- Insert 3 mock hiking events
insert into public.events (title, description, date, location)
values 
  (
    'Morning Ridge Trail', 
    'A moderate 5-mile loop perfect for sunrise views and bird watching.', 
    '2026-03-10 07:00:00+00', 
    'Rock Creek Park'
  ),
  (
    'Waterfall Photography Hike', 
    'Join our NGO photographer for a slow-paced walk to the falls. Bring your camera!', 
    '2026-04-15 10:00:00+00', 
    'Great Falls Park'
  ),
  (
    'Summit Sunset Trek', 
    'A challenging uphill climb to celebrate the Spring Equinox. Headlamps required!', 
    '2026-03-20 17:30:00+00', 
    'Skyline Drive - Mile 42'
  );