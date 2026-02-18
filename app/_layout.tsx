import "../global.css"; // Your Tailwind entry point
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* (tabs) refers to the folder containing your tab navigation */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}