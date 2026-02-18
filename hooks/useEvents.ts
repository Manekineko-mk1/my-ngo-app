import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  return { 
    nextEvent: events[0], 
    upcomingEvents: events.slice(1, 4), 
    loading, 
    refresh: fetchEvents 
  };
}