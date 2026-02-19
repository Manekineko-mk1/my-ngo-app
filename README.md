# 🌲 NGO Hiking & Event App (PoC)

## 🚀 Quick Start Commands

### 📱 Development
| Command | Action |
| :--- | :--- |
| `npm run android` | Starts the app on an Android Emulator or connected device. |
| `npm run ios` | Starts the app on iOS Simulator (**Requires macOS + Xcode**). |
| `npm run web` | Starts the web version of the app in your browser. |
| `npx expo start` | Opens the Expo Dev Menu (Scan the QR code with **Expo Go** on your phone). |

> **Note for iOS:** If you do not have a Mac, use the **Expo Go** app on your iPhone. Run `npx expo start` and scan the QR code to see your progress on your physical device.

---

## 🛠 Tech Stack
- **Framework:** Expo (React Native) + Expo Router
- **Styling:** NativeWind (Tailwind CSS)
- **Database/Auth:** Supabase
- **Icons:** Lucide React Native
- **Platform:** iOS, Android, and Web (Universal)
- **State Management:** React Context API (`useLanguage`).
- **Backend:** Supabase (Auth & PostgreSQL).
- **Icons:** Lucide React Native.

---

## ⚙️ Required Supabase SQL
To allow admins to save events, ensure the following RLS policy is active:
```sql
CREATE POLICY "Allow authenticated insert" 
ON public.events FOR INSERT 
TO authenticated 
WITH CHECK (true);
```

---

## 🎯 Key Features
1. **Event Calendar:** Monthly "accordion" view of upcoming hikes.
2. **Self Check-in:** A simple "I'm Here" button for hikers at the trailhead.
3. **NGO Mission:** A dedicated tab explaining the organization's goals.
4. **Newsletter:** Lightweight rendering of Mailchimp campaigns.

---

## 🌐 Internationalization (i18n)
The app features a custom Global Language Service supporting:
- **Languages:** English, Traditional Chinese (繁體中文), and French.
- **Dynamic UI:** Real-time translation of Home, Mission, and Navigation Tab titles.
- **Cross-Platform Picker:** Custom Modal-based language selector for consistent behavior on Web and Mobile.

---

## 🚀 Admin Features
The app now includes a built-in Event Manager for authenticated admins:
- **Floating Creator:** Tap the `+` button on the Home screen.
- **Manual Date Entry:** Enter dates in `YYYY-MM-DD HH:MM` format.
- **Live Sync:** New events automatically become the "Hero" card if they are the most upcoming.

---

## 📝 Environment Setup
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 🛠 Environment-Specific Fixes (Corporate Network)
If the standard `npm run web` fails due to `fetch failed` errors, use:
- `npx expo start --web --offline` - Starts the server without calling Expo APIs.
- `npx expo start --web --offline --clear` - Resets the cache (use this if styling or Babel errors occur).

---

### ⚙️ Critical Configuration
- **Babel:** Uses `nativewind/babel` as a **preset** (not a plugin) to support Tailwind-style classes.
- **Metro:** Custom `metro.config.js` is required to process `global.css`.
- **Global Styles:** `global.css` must exist at the root with `@tailwind` directives.