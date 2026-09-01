import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const courses = await prisma.course.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
      return NextResponse.json(courses);
    } catch {}
  }
  // fallback mock
  const { mockCourses } = await import("@/lib/data");
  return NextResponse.json(mockCourses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { title, description, price, categoryId, level, duration, thumbnail, instructor } = body;
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

  if (process.env.DATABASE_URL) {
    try {
      const course = await prisma.course.create({
        data: { title, slug, description: description || "", price: Number(price) || 0, categoryId: categoryId || null, level: level || "BEGINNER", duration, thumbnail, instructor },
      });
      return NextResponse.json(course);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ id: "mock-" + Date.now(), title, slug, price, note: "Created in memory (no DB)" });
}
