"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function About() {
  const { t } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-8 items-center">
      <div className="grid grid-cols-2 gap-4">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=350&fit=crop" className="rounded-xl object-cover h-[260px] w-full" alt="class" />
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=350&fit=crop" className="rounded-xl object-cover h-[260px] w-full mt-8" alt="class2" />
      </div>
      <div className="space-y-4">
        <div className="text-xs font-bold text-blue-600 tracking-widest">GET TO KNOW ABOUT US</div>
        <h2 className="text-3xl font-black">Dive into our Online Courses<br />and Ignite Your Learning!</h2>
        <p className="text-sm text-gray-600">Collaboratively simplify user friendly networks after principle centered coordinate effective methods of empowerment distributed niche markets pursue market positioning web-readiness after resource sucking value added systems via mission.</p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="text-blue-600">✓</span> Dramatically re-engineer value added systems via mission</li>
          <li className="flex gap-2"><span className="text-blue-600">✓</span> Access more than 100K online courses</li>
          <li className="flex gap-2"><span className="text-blue-600">✓</span> Learn the high-impact skills that top companies want.</li>
        </ul>
        <Link href="/courses" className="inline-block bg-[#0166FF] text-white px-6 py-3 rounded-md text-sm font-bold mt-2">{t("about.btn")} →</Link>
      </div>
    </section>
  );
}
