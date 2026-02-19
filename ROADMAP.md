# NGO Hiking App: Implementation Roadmap

## Stage 1: Infrastructure & Foundation (Completed)
- [x] Initialize Expo project with `tabs` template.
- [x] Configure Supabase (CLI/Folder structure initialized).
- [x] Setup NativeWind (Fixed Babel preset & Metro config).
- [x] **Milestone:** App boots with "Forest Green" theme and 4-tab skeleton.

## Stage 1.5: Identity & Authentication (Completed)
- [x] Build `app/login.tsx` with Mode-Switching UI.
- [x] Fix Layout Shift (Rock Solid UI).
- [x] **Milestone:** Auth system is complete with Logout support.

## Stage 2: Data Modeling & Home Screen (Completed)
- [x] Define PostgreSQL schema for `events`.
- [x] Implement real-time fetch with "Smart Hero" logic (Date-sorted).
- [x] Build Admin "Floating Action Button" (FAB).
- [x] Implement "Create Event" Modal with manual date-string validation.
- [x] Setup Supabase RLS Policies for authenticated inserts.
- [x] **Milestone:** App is live with dynamic admin controls.

## Stage 3: Localization & User Identity (Completed / Current)
- [x] **Global Localization:** Created `useLanguage` with EN/ZH/FR support.
- [x] **Tab Navigation:** Translated the bottom tab bar.
- [x] **Identity Linkage:** Created `profiles` table and SQL Trigger to link with Auth.
- [x] **RLS Policies:** Configured Row Level Security to allow users to update their own data.
- [x] **Profile Screen:** Implemented Name syncing and Role-based badges (Admin/Member).
- [ ] **Language Persistence:** Finalize the Language Selector in Profile to save preference to DB.
- [ ] **Role-Based UI:** Update Home Screen FAB to only show for Admin role

## Stage 4: Core Features
**Goal:** Build the functional heart of the app.
- [x] Create Global `useLanguage` Context Provider.
- [x] Implement 3-Language Support (EN, ZH, FR).
- [x] Build custom Language Selection Modal for cross-platform compatibility.
- [x] Refactor Mission tab with full native text.
- [ ] Expanable Hero cards for event details (Date, Time, Description, Location (Clickable link for Google Map or iOS Map), Sign Up, Check-in (if already signup and the event is 'Active'), Cancel Sign Up)
- [ ] Build the "Profile" screen (Name, Email, Contact Number, Role (Hidden: user or admin), Prefer language setting, Profile Edit).
- [ ] Implement "Share Event" features.
- [ ] Implement the "Self Check-in" button:
    - Optimistic UI updates (using Zustand or TanStack Query).
    - Local persistence for offline trailhead usage.
- [ ] Create the "Admin View" (hidden or role-based) to see the attendee checklist.
    - A Grid-based attendee checklist, activate using FAB. Click on attendee icon can show attendee information (Name, Contact, Force Checkin, Dismiss)
- [x ] Create `profiles` and `registrations` tables in Supabase.
- [ ] Build **Profile Screen**:
    - Role-based UI logic (Hide/Show Admin FAB).
    - Persistent Language preference.
- [ ] Build **Event Details Screen** with dynamic routing (`/event/[id]`).
- [ ] Create `registrations` table logic (Sign-up for hikes).
- [ ] Build the **Attendee Grid** for Admins (The "Grid of Faces").
- [ ] Implement offline caching for trailhead check-ins.    
- [ ] Build **Event Details Screen**:
    - "Sign Up" button for members.
    - "Admin Grid" (The Grid of Faces) for check-ins.
- [ ] Implement local caching for attendee lists (Offline-ready).    
- [ ] **Milestone:** A user can "Check-in" and the admin sees the status update.

## Stage 5: Mission & Content
**Goal:** Polish the NGO brand identity.
- [ ] Implement the "Mission" tab with high-quality typography and forest-themed backgrounds.
- [ ] Build a Supabase Edge Function to fetch the latest Mailchimp campaign.
- [ ] Integrate a lightweight Markdown renderer for newsletters.
- [ ] **Milestone:** The app feels like a complete "NGO Hub" beyond just a tool.

## Stage 6: Deployment & PoC Launch (Completed!)
- [x] Create Vercel account and link GitHub repository.
- [x] Configure Build Settings (`npx expo export` / `dist`).
- [x] Port Supabase Environment Variables.
- [x] **Milestone:** App is live on Vercel and accessible via mobile web browser!

## Stage 7: Polish & Core Features (Tomorrow)
- [ ] **Web UI Fix:** Refactor Home Header to prevent title overflow on browsers.
- [ ] **Language Selector:** Add the Modal/Dropdown to the Profile tab.
- [ ] **Role-Based FAB:** Finally hide that Admin button from regular users!
- [ ] **Event Routing:** Start the "Sign Up" flow for hikers.