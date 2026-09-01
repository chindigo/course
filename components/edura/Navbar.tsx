"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (session?.user as any)?.role;

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#0F2239] text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <span>📞 +111 (564) 568 25</span>
            <span>✉️ info@edura.com</span>
            <span>🕒 Mon - Sat: 8:00 - 15:00</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Follow Us: f in x</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#0166FF] text-white font-black px-3 py-2 rounded text-lg">◆ EDURA</div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-blue-600">{t("nav.home")} ▾</Link>
          <Link href="/courses" className="hover:text-blue-600">{t("nav.courses")} ▾</Link>
          <Link href="/courses" className="hover:text-blue-600">{t("nav.teachers")} ▾</Link>
          <Link href="/courses" className="hover:text-blue-600">{t("nav.pages")} ▾</Link>
          <Link href="/courses" className="hover:text-blue-600">{t("nav.blog")}</Link>
          <Link href="/contact" className="hover:text-blue-600">{t("nav.contact")}</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3 flex-1 justify-end max-w-md">
          <div className="relative flex-1">
            <input placeholder={t("search.placeholder")} className="w-full border rounded-full px-4 py-2 text-sm pr-8" />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Heart className="h-5 w-5" /><span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <ShoppingCart className="h-5 w-5" /><span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          {session ? (
            <>
              <Link href={role === "ADMIN" ? "/admin" : "/dashboard"} className="bg-[#0166FF] text-white px-4 py-2 rounded-full text-sm font-semibold">
                {role === "ADMIN" ? t("auth.admin") : t("auth.dashboard")}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gray-600 px-3">{t("auth.logout")}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-3">🔒 {t("auth.login")}</Link>
              <Link href="/contact" className="bg-[#0166FF] text-white px-5 py-2 rounded-full text-sm font-semibold hidden xl:inline">CONTACT US →</Link>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-white p-4 space-y-3">
          <Link href="/" className="block py-2">{t("nav.home")}</Link>
          <Link href="/courses" className="block py-2">{t("nav.courses")}</Link>
          <Link href="/contact" className="block py-2">{t("nav.contact")}</Link>
          <div className="flex gap-2 pt-2">
            {session ? (
              <Link href={role === "ADMIN" ? "/admin" : "/dashboard"} className="bg-blue-600 text-white px-4 py-2 rounded flex-1 text-center">{role === "ADMIN" ? "Admin" : "Dashboard"}</Link>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded flex-1 text-center">Login</Link>
            )}
          </div>
          <div className="flex justify-center pt-2"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  );
}
