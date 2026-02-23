import React, { createContext, useContext, useState } from "react";

type Language = "en" | "zh" | "fr";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => any;
}

const DICTIONARY: Record<Language, any> = {
  en: {
    welcome: "Welcome Back",
    orgName: "Hong Kong Cultural Learning Society in Montreal (HKCLS)",
    home: "Home",
    events: "Events",
    mission: "Mission",
    profile: "Profile",
    upcomingEvent: "Upcoming Event",
    futureEvents: "Future Events",
    missionTitle: "Our Mission",
    missionBody:
      "Hong Kong Cultural Learning Society in Montreal (HKCLS) is a non-profit organization registered in Quebec, Canada founded in 2021 by volunteers. HKCLS promotes Hong Kong culture in Canada, including its languages, food & cuisine, traditions, music & arts, entertainment & sports, as well as common values.",
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
    newEvent: "New Event",
    eventTitle: "Event Title",
    eventLocation: "Location",
    eventDate: "Date & Time",
    eventDescription: "Description",
    createBtn: "Post Event",
    creating: "Creating...",
    missingInfo: "Please fill out title, location, and date.",
    invalidDate: "Use format: YYYY-MM-DD HH:MM",
    descPlaceholder: "What should participants bring?...",
    noUpcomingEvents: "No upcoming events scheduled",
    verifiedAttendee: "Verified Attendee",
    cancelRegistration: "Cancel Registration",
    location: "Location",
    description: "Description",
    time: "Time",
    editEvent: "Edit Event",
  deleteEvent: "Delete Event",
  confirmDelete: "Are you sure you want to delete this event?",
  delete: "Delete",
  cancel: "Cancel",
  updateEventSuccess: "Event updated successfully",
  noAttendees: "No one signed up yet."
  },
  zh: {
    welcome: "歡迎回來",
    orgName: "滿地可香港文化社",
    home: "主頁",
    events: "活動",
    mission: "宗旨",
    profile: "個人",
    upcomingEvent: "即將舉行的活動",
    futureEvents: "未來活動",
    missionTitle: "本會宗旨",
    missionBody:
      "滿地可香港文化社於2021年由義工創立，是一個魁北克註冊非牟利團體。滿地可香港文化社以傳承香港文化為宗旨，積極在加國推廣香港的語言文字、飲食、傳統習俗、音樂藝術、娛樂運動及價值觀。",
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
    attendees: "出席名單",
    newEvent: "新增活動",
    eventTitle: "活動名稱",
    eventLocation: "地點",
    eventDate: "日期及時間",
    eventDescription: "活動描述",
    createBtn: "發佈活動",
    creating: "正在建立...",
    missingInfo: "請填寫標題、地點及日期。",
    invalidDate: "使用格式：YYYY-MM-DD HH:MM",
    descPlaceholder: "有什麼需要注意？...",
    noUpcomingEvents: "目前沒有即將舉行的活動",
    verifiedAttendee: "已簽到",
    cancelRegistration: "取消報名",
    location: "地點",
    description: "活動詳情",
    time: "時間",
    editEvent: "編輯活動",
  deleteEvent: "刪除活動",
  confirmDelete: "您確定要刪除此活動嗎？",
  delete: "刪除",
  cancel: "取消",
  updateEventSuccess: "活動已更新",
  noAttendees: "暫時還沒有人報名。",
  },
  fr: {
    welcome: "Bienvenue",
    orgName: "Société de l’apprentissage culturelle de Hongkong à Montréal",
    home: "Accueil",
    events: "Événements",
    mission: "Mission",
    profile: "Profil",
    upcomingEvent: "Événement à venir",
    futureEvents: "Événements futurs",
    missionTitle: "Mission",
    missionBody:
      "Société de l’apprentissage culturelle de Hongkong à Montréal est un OSBL fondé en 2021 par des bénévoles. Il a comme mission de promouvoir la culture hongkongaise, la langue et l’écriture, la nourriture et la cuisine, les traditions, les musiques et les arts, le divertissement et les sports, ainsi que les valeurs communes de Hong Kong au Canada.",
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
    newEvent: "Nouvel Événement",
    eventTitle: "Titre de l'événement",
    eventLocation: "Lieu",
    eventDate: "Date et Heure",
    eventDescription: "Description",
    createBtn: "Publier l'événement",
    creating: "Création...",
    missingInfo: "Veuillez remplir le titre, le lieu et la date.",
    invalidDate: "Utilisez le format : AAAA-MM-JJ HH:MM",
    descPlaceholder: "Que doivent apporter les participants ?...",
    noUpcomingEvents: "Aucun événement à venir prévu",
    verifiedAttendee: "Présence vérifiée",
    cancelRegistration: "Annuler l'inscription",
    location: "Lieu",
    description: "Description",
    time: "Heure",
    editEvent: "Modifier l'événement",
  deleteEvent: "Supprimer l'événement",
  confirmDelete: "Êtes-vous sûr de vouloir supprimer cet événement ?",
  delete: "Supprimer",
  cancel: "Annuler",
  updateEventSuccess: "Événement mis à jour",
  noAttendees: "Aucun participant inscrit pour le moment.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string) => DICTIONARY[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
