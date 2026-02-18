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
    nextHike: "Next Hike",
    moreAdv: "More Adventures",
    missionTitle: "Our Mission",
    missionBody: "Hong Kong Cultural Learning Society in Montreal (HKCLS) is a non-profit organization registered in Quebec, Canada founded in 2021 by volunteers. HKCLS promotes Hong Kong culture in Canada, including its languages, food & cuisine, traditions, music & arts, entertainment & sports, as well as common values.",
    readMore: "Read full story",
    pillars: ["Tradition", "Culture", "Values"]
  },
  zh: {
    welcome: "歡迎回來",
    nextHike: "下一場活動",
    moreAdv: "更多活動",
    missionTitle: "本會宗旨",
    missionBody: "滿地可香港文化社於2021年由義工創立，是一個魁北克註冊非牟利團體。滿地可香港文化社以傳承香港文化為宗旨，積極在加國推廣香港的語言文字、飲食、傳統習俗、音樂藝術、娛樂運動及價值觀。",
    readMore: "閱讀更多",
    pillars: ["傳統", "文化", "價值觀"]
  },
  fr: {
    welcome: "Bienvenue",
    nextHike: "Prochaine Rando",
    moreAdv: "Plus d'aventures",
    missionTitle: "Mission",
    missionBody: "Société de l’apprentissage culturelle de Hongkong à Montréal est un OSBL fondé en 2021 par des bénévoles. Il a comme mission de promouvoir la culture hongkongaise, la langue et l’écriture, la nourriture et la cuisine, les traditions, les musiques et les arts, le divertissement et les sports, ainsi que les valeurs communes de Hong Kong au Canada.",
    readMore: "En savoir plus",
    pillars: ["Tradition", "Culture", "Valeurs"]
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