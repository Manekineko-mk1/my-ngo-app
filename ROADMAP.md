# NGO Event App: Implementation Roadmap

## Stage 1: Infrastructure & Foundation (Completed)
- [x] Initialize Expo project and Supabase.
- [x] Configure NativeWind and "Forest Green" theme.

## Stage 2: Data Modeling & Auth (Completed)
- [x] Define PostgreSQL schema and Auth system.
- [x] Implement "Smart Hero" logic and Admin FAB.
- [x] **Milestone:** Auth system complete with Logout and Role support.

## Stage 3: Localization & Admin Control (Completed)
- [x] **Global Localization:** Created `useLanguage` (EN/ZH/FR).
- [x] **Admin Actions:** Full Create, Update, and Delete (CRUD) logic for events.
- [x] **Map Integration:** Cross-platform deep-linking (Apple/Google Maps).
- [x] **Security:** Purged secrets from Git history; moved to Vercel Env Vars.
- [x] **Role-Based UI:** FAB and Edit/Delete buttons correctly hidden from regular users.

## Stage 4: Social & Attendance (Tomorrow's Goal)
**Goal:** Transition from "Admin Management" to "User Participation."
- [x] **Attendee Grid (The "Grid of Faces"):** - Build a visual list inside Event Details showing who is signed up.
- [x] **Admin Force-Check-in:** - Allow admins to manually check-in hikers who forget their phones.
- [x] **Profile Completion:** - Add "Contact Number" field to profile so hikers can be reached during emergencies.
- [x] **Language Persistence:** - Save the user's language choice to their Supabase profile so it's the same on every device.

## Stage 5: Mission & Polish
- [ ] Implement high-quality typography for the whole app.
- [ ] Offline caching for trailhead check-ins (service workers/local storage).
- [ ] **Milestone:** The app is ready for a real-world trail test.