import { mockCourses } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = mockCourses.find((c) => c.slug === slug);
  if (!course) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <img src={course.thumbnail} alt={course.title} className="w-full h-[340px] object-cover rounded-xl" />
          <div className="bg-white p-6 rounded-xl border">
            <div className="flex gap-2 text-xs mb-2">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full">{course.category.name}</span>
              <span className="border px-2 py-1 rounded-full">{course.level}</span>
              <span className="border px-2 py-1 rounded-full">{course.duration}</span>
            </div>
            <h1 className="text-2xl font-black mb-2">{course.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span>👨‍🏫 {course.instructor}</span>
              <span>⭐ {course.rating} rating</span>
              <span>👥 {course.students}+ students</span>
              <span>📖 {course.lessons} lessons</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-3">What You&apos;ll Learn</h3>
            <ul className="grid md:grid-cols-2 gap-2 text-sm">
              <li>✓ Hands-on projects</li>
              <li>✓ Certificate of completion</li>
              <li>✓ Lifetime access</li>
              <li>✓ Community support</li>
              <li>✓ Quizzes & assignments</li>
              <li>✓ Downloadable resources</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-3">Course Content</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border p-3 rounded">1. Introduction & Overview <span>12:45 • Preview</span></div>
              <div className="flex justify-between border p-3 rounded">2. Core Concepts <span>22:10</span></div>
              <div className="flex justify-between border p-3 rounded">3. Hands-on Project <span>35:00</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold mb-3">Discussions</h3>
            <p className="text-xs text-gray-500 mb-3">Community & Engagement — ask questions under lessons</p>
            <textarea placeholder="Ask a question..." className="w-full border rounded p-3 text-sm" rows={3}></textarea>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm">Post Comment</button>
            <div className="mt-4 space-y-2 text-sm">
              <div className="border p-3 rounded"><b>Sarah:</b> Great course! When is the next live session?</div>
              <div className="border p-3 rounded"><b>Admin:</b> Live session every Saturday 3pm. Check dashboard.</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border sticky top-24">
            <div className="text-2xl font-black mb-2">{formatPrice(course.price)}</div>
            {course.price === 0 && <div className="text-xs text-green-600 mb-3">Free enrollment — instant access</div>}
            <Link href={`/checkout/${course.id}`} className="block text-center bg-[#0166FF] text-white py-3 rounded font-bold text-sm">
              {course.price === 0 ? "Enroll Now — Free" : "Buy Now"}
            </Link>
            <Link href={`/learn/${course.id}`} className="block text-center border py-3 rounded font-bold text-sm mt-2">Preview Course</Link>
            <ul className="text-xs text-gray-600 space-y-2 mt-4">
              <li>✓ 30-Day Money-Back Guarantee</li>
              <li>✓ Lifetime Access</li>
              <li>✓ Downloadable Resources</li>
              <li>✓ Certificate of Completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
