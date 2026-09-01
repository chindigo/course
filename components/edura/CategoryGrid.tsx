"use client";
import Link from "next/link";
import { mockCategories } from "@/lib/data";
export function CategoryGrid() {
  return (
    <section className="bg-[#F3F8FF] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="text-xs font-bold text-blue-600">POPULAR COURSES</div>
          <h2 className="text-2xl font-black">Our Popular Online Courses</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {mockCategories.map((cat) => (
            <Link key={cat.id} href={`/courses?category=${cat.slug}`} className={`p-4 rounded-lg flex items-center gap-3 ${cat.name === "Digital Marketing" ? "bg-[#0166FF] text-white" : "bg-white"} shadow-sm hover:shadow`}>
              <div className="bg-blue-50 p-2 rounded text-blue-600">📚</div>
              <div>
                <div className="font-bold text-sm">{cat.name}</div>
                <div className="text-xs opacity-70">{cat.count} Courses</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
