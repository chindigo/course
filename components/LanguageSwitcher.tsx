"use client";
import { useTranslation, Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="bg-transparent text-xs border border-gray-200 rounded px-2 py-1"
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="am">አማ</option>
      <option value="fr">FR</option>
      <option value="ar">AR</option>
    </select>
  );
}
