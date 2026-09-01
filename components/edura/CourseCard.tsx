import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="h-44 w-full object-cover" />
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">● {course.duration}</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-1 text-xs text-yellow-500">★★★★☆ <span className="text-gray-400">({course.rating})</span></div>
        <Link href={`/courses/${course.slug}`} className="font-bold text-sm leading-tight line-clamp-2 hover:text-blue-600">{course.title}</Link>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>📖 Lesson {course.lessons}</span>
          <span>👥 Students {course.students}+</span>
          <span>• {course.level}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs"><img src={`https://i.pravatar.cc/24?u=${course.instructor}`} className="h-6 w-6 rounded-full" alt="" />{course.instructor}</div>
          <div className={`text-xs font-black ${course.price === 0 ? "text-green-600" : "text-blue-600"}`}>{formatPrice(course.price)}</div>
        </div>
      </div>
    </div>
  );
}
