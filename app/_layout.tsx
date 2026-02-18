import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { LanguageProvider } from "@/hooks/useLanguage";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false); // Track if layout is ready
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Listen for Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true); // Initial session check is done
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) return; // Don't navigate until we've checked the initial session

    const inAuthGroup = segments[0] === "(tabs)";

    // Using a micro-task delay ensures the navigator is fully mounted
    const timeout = setTimeout(() => {
      if (!session && inAuthGroup) {
        router.replace("/login");
      } else if (session && segments[0] === "login") {
        router.replace("/(tabs)");
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [session, segments, isReady]);

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </LanguageProvider>
  );
}
