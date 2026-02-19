# Project Context: NGO Hiking App (PoC)

## 1. Executive Summary
- **Project Name:** NGO Hiking Event & Check-in App
- **Core Purpose:** A lightweight tool for NGO members to view upcoming hiking events, read newsletters, and perform self-reported check-ins at trailheads.
- **Primary Goal:** Replace manual checklists with a high-trust, low-friction digital "I'm Here" system.

## 2. Tech Stack (The "Lean NGO" Stack)
- **Frontend:** React Native (via Expo Router) for Universal Web & Mobile.
- **Backend/Auth:** Supabase (PostgreSQL + Row Level Security).
- **Styling:** NativeWind (Tailwind CSS for React Native).
- **State Management:** Zustand (for lightweight local state) + TanStack Query (for server state/caching).
- **Integrations:** Mailchimp API (via Supabase Edge Functions).
- **Performance:** `expo-image` for high-compression WebP/BlurHash support.

## 3. UI/UX Architecture
- **Theme:** "Forest Green & Minimalist" (Primary Color: #228B22).
- **Navigation:** 4-Tab Bottom Bar:
    - `Home`: Logo, "Next Adventure" Hero Card, and Recent News.
    - `Calendar`: Monthly tabs with accordion-style expandable event cards.
    - `Mission`: Static, high-typography page regarding NGO goals/impact.
    - `Profile`: User settings, check-in history, and Auth.
- **Styling Rule:** Always use className via NativeWind; verify nativewind-env.d.ts is present to satisfy TypeScript.

## 4. Technical Constraints & Requirements
- **Budget:** Strict $0 (Limit to Free Tiers of Supabase, Vercel, and Expo EAS).
- **Data Usage:** Must be highly optimized. Avoid large JS bundles and heavy assets. Use WebP for all images.
- **Connectivity:** Must support "Offline-First" for check-ins at trailheads with no signal (Background sync).
- **Developer Level:** Managed by a developer (No-Code/Low-Code is avoided for maximum control).

## 5. Key Functional Logic
- **Smart Hero:** Home screen automatically sorts events by `date` (ASC) and displays the closest upcoming hike as the Hero card.
- **Admin Event Creator:** Authenticated users see a FAB (Floating Action Button) to trigger a creation Modal.
- **Date Handling:** Due to environment constraints on native pickers, the app uses a validated string format (`YYYY-MM-DD HH:MM`) which is parsed into ISO strings before Supabase insertion.
- **Check-in:** Self-reported "I'm Here" button. Logic should be idempotent and timestamped.
- **Newsletter:** Fetching HTML/Markdown from Mailchimp and rendering locally to avoid webview overhead.
- **Admin:** A hidden/role-based view to see the "Missing Persons" list based on sign-ups vs. check-ins.

## 6. Instructions for AI Assistant
- Provide code snippets compatible with **Expo Router v3+**.
- Prioritize **NativeWind** for styling.
- Ensure all database suggestions include **SQL for Supabase**.
- Maintain the established **Forest Green/Minimalist** design language.