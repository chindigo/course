import { Hero } from "@/components/edura/Hero";
import { About } from "@/components/edura/About";
import { CategoryGrid } from "@/components/edura/CategoryGrid";
import { CourseCard } from "@/components/edura/CourseCard";
import { mockCourses } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <CategoryGrid />
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCourses.slice(0, 4).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/courses" className="bg-[#0166FF] text-white px-6 py-3 rounded-md text-sm font-bold inline-block">
            VIEW ALL COURSES →
          </Link>
        </div>
      </section>

      {/* Community / Engagement teaser */}
      <section className="bg-white border-y py-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 border rounded-xl">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-bold">Discussion Forums</h3>
            <p className="text-xs text-gray-500">Ask questions under each lesson and get support from instructors.</p>
          </div>
          <div className="p-6 border rounded-xl">
            <div className="text-2xl mb-2">📹</div>
            <h3 className="font-bold">Course Player</h3>
            <p className="text-xs text-gray-500">Video lessons, PDFs, quizzes with progress tracking.</p>
          </div>
          <div className="p-6 border rounded-xl">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-bold">Certificates</h3>
            <p className="text-xs text-gray-500">Earn completion certificates and track your learning journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
