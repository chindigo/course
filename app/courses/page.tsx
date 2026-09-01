import { mockCourses, mockCategories } from "@/lib/data";
import { CourseCard } from "@/components/edura/CourseCard";
import Link from "next/link";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; level?: string }> }) {
  const params = await searchParams;
  let courses = mockCourses;

  // TODO: replace with Prisma when DB available
  // const courses = await prisma.course.findMany({ where: {...}, include:{category:true} })

  if (params.q) {
    const q = params.q.toLowerCase();
    courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }
  if (params.category) {
    courses = courses.filter((c) => mockCategories.find((cat) => cat.slug === params.category)?.id === c.categoryId);
  }
  if (params.level) {
    courses = courses.filter((c) => c.level === params.level);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside className="lg:w-64 space-y-4">
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Search</h3>
            <form className="flex gap-2">
              <input name="q" defaultValue={params.q} placeholder="Search courses..." className="flex-1 border rounded px-3 py-2 text-sm" />
              <button className="bg-blue-600 text-white px-3 rounded text-sm">Go</button>
            </form>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Categories</h3>
            <div className="space-y-1 text-sm">
              <Link href="/courses" className={`block px-2 py-1 rounded ${!params.category ? "bg-blue-50 text-blue-600" : ""}`}>All</Link>
              {mockCategories.map((cat) => (
                <Link key={cat.id} href={`/courses?category=${cat.slug}`} className={`block px-2 py-1 rounded ${params.category === cat.slug ? "bg-blue-50 text-blue-600" : ""}`}>{cat.name} ({cat.count})</Link>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Level</h3>
            <div className="space-y-1 text-sm">
              <Link href="/courses" className="block">All Levels</Link>
              <Link href="/courses?level=BEGINNER" className={`block ${params.level === "BEGINNER" ? "text-blue-600" : ""}`}>Beginner</Link>
              <Link href="/courses?level=INTERMEDIATE" className={`block ${params.level === "INTERMEDIATE" ? "text-blue-600" : ""}`}>Intermediate</Link>
              <Link href="/courses?level=ADVANCED" className={`block ${params.level === "ADVANCED" ? "text-blue-600" : ""}`}>Advanced</Link>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black">Courses ({courses.length})</h1>
            <span className="text-xs text-gray-500">Showing {courses.length} results</span>
          </div>
          {courses.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-xl border">No courses found. Try different filters.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
