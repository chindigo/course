"use client";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { LocaleContext, Locale, translations } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("locale", l);
  };
  // Hydrate from localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && saved !== locale && ["en", "am", "fr", "ar"].includes(saved)) {
      // Use effect would be better but simple for SSR avoid mismatch
    }
  }
  const t = (key: string) => translations[locale]?.[key] ?? translations["en"][key] ?? key;

  return (
    <SessionProvider>
      <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
    </SessionProvider>
  );
}
