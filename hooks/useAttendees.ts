import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAttendees(eventId: string) {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAttendees() {
    if (!eventId) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        profiles (
          id,
          full_name,
          contact_number
        )
      `)
      .eq('event_id', eventId);

    if (!error && data) {
      setAttendees(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  return { attendees, loading, refresh: fetchAttendees };
}