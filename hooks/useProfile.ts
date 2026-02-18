import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from './useLanguage';

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setLang } = useLanguage();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get current session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setLoading(false);
        return;
      }

      // 2. Fetch the profile row
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('id, full_name, preferred_lang, role')
        .eq('id', user.id)
        .single();

      if (dbError) {
        throw dbError;
      }

      if (data) {
        setProfile(data);
        // Sync app language with database preference
        if (data.preferred_lang) {
          setLang(data.preferred_lang as any);
        }
      }
    } catch (err: any) {
      console.error("fetchProfile Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLang]);

  const updateProfile = async (updates: { full_name?: string; preferred_lang?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          preferred_lang: updates.preferred_lang,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh data locally after successful update
      await fetchProfile();
      return { success: true, error: null };
    } catch (err: any) {
      console.error("updateProfile Error:", err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    error, 
    updateProfile, 
    refreshProfile: fetchProfile 
  };
}