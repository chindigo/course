"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative bg-[#F3F8FF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0166FF] tracking-widest">
            <span className="text-red-500">⟶</span> {t("hero.badge")}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight">
            <span className="text-[#0166FF]">{t("hero.title1")}</span> <br />
            <span className="text-gray-900">{t("hero.title2")}</span>
          </h1>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-blue-600 rounded-full"/> {t("hero.certified")}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-red-500 rounded-full"/> {t("hero.skills")}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 bg-orange-400 rounded-full"/> {t("hero.life")}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/courses" className="bg-[#0166FF] text-white px-6 py-3 rounded-md text-sm font-bold">GET STARTED →</Link>
            <Link href="/courses" className="bg-[#0F2239] text-white px-6 py-3 rounded-md text-sm font-bold">OUR COURSES →</Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-90 -z-10 translate-x-6 -translate-y-2 hidden lg:block" style={{ width: 400, height: 400, border: "3px solid #0166FF" }} />
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=600&fit=crop&crop=face"
              alt="Student"
              className="rounded-2xl w-[360px] h-[420px] object-cover"
            />
            <div className="absolute -bottom-2 -left-6 bg-white shadow-lg rounded-full px-4 py-3 flex items-center gap-2 text-sm">
              <div className="bg-blue-100 p-2 rounded-full">👥</div>
              <div><div className="font-bold">16500+</div><div className="text-xs text-gray-500">Active Students</div></div>
            </div>
            <div className="absolute top-6 -right-6 bg-white shadow-lg rounded-full px-4 py-3 flex items-center gap-2 text-sm">
              <div className="bg-red-100 p-2 rounded-full text-red-600">▶</div>
              <div><div className="font-bold">7500+</div><div className="text-xs text-gray-500">Online Video Courses</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2"><span className="bg-blue-600 text-white p-2 rounded-full text-xs">◉</span> 20k+ Online Courses</div>
          <div className="flex items-center gap-2"><span className="bg-blue-600 text-white p-2 rounded-full">◐</span> Lifetime Access</div>
          <div className="flex items-center gap-2"><span className="bg-blue-600 text-white p-2 rounded-full">◎</span> Value For Money</div>
          <div className="flex items-center gap-2"><span className="bg-blue-600 text-white p-2 rounded-full">🎧</span> Lifetime Support</div>
          <div className="flex items-center gap-2"><span className="bg-blue-600 text-white p-2 rounded-full">👥</span> Community Support</div>
        </div>
      </div>
    </section>
  );
}
