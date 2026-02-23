# 🌲 NGO Event App (PoC)

## 🚀 Quick Start Commands

### 📱 Development
| Command | Action |
| :--- | :--- |
| `npm run android` | Starts the app on an Android Emulator or connected device. |
| `npm run ios` | Starts the app on iOS Simulator (**Requires macOS + Xcode**). |
| `npm run web` | Starts the web version of the app in your browser. |
| `npx expo start` | Opens the Expo Dev Menu (Scan the QR code with **Expo Go** on your phone). |

---

## 🛠 Tech Stack
- **Framework:** Expo (React Native) + Expo Router
- **Styling:** NativeWind (Tailwind CSS)
- **Database/Auth:** Supabase (Auth & PostgreSQL)
- **Icons:** Lucide React Native
- **State Management:** React Context API (`useLanguage`) & Custom Hooks (`useRegistration`, `useAttendees`)

---

## 🚀 Admin Features
The app includes a suite of tools for authenticated admins:
- **Floating Creator:** Quickly add events via the `+` button on the Home screen.
- **Attendance Management:** View a live list of all signed-up hikers (Attendee Grid).
- **Manual Check-in:** Admins can manually toggle the "Verified" status for participants who forget their devices.
- **Live Sync:** The registration footer and attendee list stay synchronized using internal ID tracking (`registrationId`).
- **Smart Hero:** New events automatically become the "Hero" card if they are the most upcoming.

---

## ⚙️ Required Supabase SQL
Ensure your `registrations` table and RLS policies allow for status updates:
```sql
-- Allow admins to update registration status
CREATE POLICY "Admins can update status" 
ON public.registrations FOR UPDATE 
TO authenticated 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));