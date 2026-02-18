import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh' | 'fr';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => any;
}

// 1. Define your "Dictionary" (Mirroring your extracted text)
const DICTIONARY: Record<Language, any> = {
  en: {
    welcome: "Welcome Back",
    orgName: "Hong Kong Cultural Learning Society in Montreal (HKCLS)",
    home: "Home",
    events: "Events",
    mission: "Mission",
    profile: "Profile",
    nextHike: "Next Hike",
    moreAdv: "More Adventures",
    missionTitle: "Our Mission",
    missionBody: "Hong Kong Cultural Learning Society in Montreal (HKCLS) is a non-profit organization registered in Quebec, Canada founded in 2021 by volunteers. HKCLS promotes Hong Kong culture in Canada, including its languages, food & cuisine, traditions, music & arts, entertainment & sports, as well as common values.",
    readMore: "Read full story",
    pillars: ["Tradition", "Culture", "Values"],
    settings: "Account Settings",
    profileTitle: "My Profile",
    displayNameLabel: "Full Name",
    contactLabel: "Contact Number",
    saveBtn: "Save Changes",
    logoutBtn: "Sign Out",
    adminBadge: "🛡️ Administrator",
    memberBadge: "🌲 Active Member",
    updateSuccess: "Profile updated successfully!",
    langPref: "Language Preference",
    error: "Error",
    signUp: "Sign Up",
    checkIn: "I'm Here (Check-in)",
    attendees: "Attendees",
  },
  zh: {
    welcome: "歡迎回來",
    orgName: "滿地可香港文化社",
    home: "主頁",
    events: "活動",
    mission: "宗旨",
    profile: "個人",
    nextHike: "下一場活動",
    moreAdv: "更多活動",
    missionTitle: "本會宗旨",
    missionBody: "滿地可香港文化社於2021年由義工創立，是一個魁北克註冊非牟利團體。滿地可香港文化社以傳承香港文化為宗旨，積極在加國推廣香港的語言文字、飲食、傳統習俗、音樂藝術、娛樂運動及價值觀。",
    readMore: "閱讀更多",
    pillars: ["傳統", "文化", "價值觀"],
    profileTitle: "我的個人檔案",
    settings: "帳戶設定",
    displayNameLabel: "全名",
    contactLabel: "聯絡電話",
    saveBtn: "儲存更改",
    langPref: "語言設定",
    logoutBtn: "登出",
    adminBadge: "🛡️ 管理員",
    memberBadge: "🌲 正式成員",
    updateSuccess: "個人檔案已更新！",
    error: "錯誤",
    signUp: "報名參加",
    checkIn: "我已到達 (簽到)",
    attendees: "出席名單"
  },
  fr: {
    welcome: "Bienvenue",
    orgName: "Société de l’apprentissage culturelle de Hongkong à Montréal",
    home: "Accueil",
    events: "Événements",
    mission: "Mission",
    profile: "Profil",
    nextHike: "Prochaine Rando",
    moreAdv: "Plus d'aventures",
    missionTitle: "Mission",
    missionBody: "Société de l’apprentissage culturelle de Hongkong à Montréal est un OSBL fondé en 2021 par des bénévoles. Il a comme mission de promouvoir la culture hongkongaise, la langue et l’écriture, la nourriture et la cuisine, les traditions, les musiques et les arts, le divertissement et les sports, ainsi que les valeurs communes de Hong Kong au Canada.",
    readMore: "En savoir plus",
    pillars: ["Tradition", "Culture", "Valeurs"],
    profileTitle: "Mon Profil",
    settings: "Paramètres du compte",
    displayNameLabel: "Nom complet",
    contactLabel: "Numéro de téléphone",
    saveBtn: "Sauvegarder",
    logoutBtn: "Se déconnecter",
    adminBadge: "🛡️ Administrateur",
    memberBadge: "🌲 Membre Actif",
    langPref: "Préférence linguistique",
    updateSuccess: "Profil mis à jour !",
    error: "Erreur",
    signUp: "S'inscrire",
    checkIn: "Je suis ici",
    attendees: "Participants",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 2. The Provider (The "Engine" that wraps your app)
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string) => DICTIONARY[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 3. The Hook (How components "subscribe" to language changes)
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}