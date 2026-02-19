import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useRegistration(eventId: string, userId: string | undefined) {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [status, setStatus] = useState<'signed_up' | 'attended' | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    if (!userId || !eventId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid 406 errors if no row exists

    setIsSignedUp(!!data);
    setStatus(data?.status || null);
    setLoading(false);
  }, [eventId, userId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const signUp = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from('registrations')
      .insert({ event_id: eventId, user_id: userId });
    
    if (!error) await checkStatus();
    return { error };
  };

  const cancel = async () => {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (!error) {
      setIsSignedUp(false);
      setStatus(null);
    }
    return { error };
  };

  const checkIn = async () => {
    const { error } = await supabase
      .from('registrations')
      .update({ status: 'attended' })
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (!error) await checkStatus();
    return { error };
  };

  return { isSignedUp, status, loading, signUp, cancel, checkIn, refresh: checkStatus };
}