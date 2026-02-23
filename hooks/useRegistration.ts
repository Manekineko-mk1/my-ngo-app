import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useRegistration(eventId: string, userId: string | undefined) {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null); // Added tracking for the record ID
  const [status, setStatus] = useState<'signed_up' | 'attended' | null>(null);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING LOGIC ---
  // Checks the database for an existing registration for this user/event
  const checkStatus = useCallback(async () => {
    if (!userId || !eventId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    setIsSignedUp(!!data);
    setStatus(data?.status || null);
    setLoading(false);
  }, [eventId, userId]);

  // Initial check on mount or when IDs change
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // --- MUTATION ACTIONS ---
  
  // Create a new registration entry
  const signUp = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from('registrations')
      .insert({ event_id: eventId, user_id: userId });
    
    if (!error) await checkStatus();
    return { error };
  };

  // Remove a registration entry
  const cancel = async () => {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (!error) {
      setIsSignedUp(false);
      setRegistrationId(null);
      setStatus(null);
    }
    return { error };
  };

  // Update status to 'attended'
  const checkIn = async () => {
    const { error } = await supabase
      .from('registrations')
      .update({ status: 'attended' })
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (!error) await checkStatus();
    return { error };
  };

  return { 
    isSignedUp,
    registrationId,
    status, 
    loading, 
    signUp, 
    cancel, 
    checkIn, 
    checkStatus
  };
}