import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// In-memory fallback for demo when DB/Blob not configured
declare global {
  var __payments: any[] | undefined;
}
if (!global.__payments) global.__payments = [];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.email) {
    return NextResponse.json({ error: "Unauthorized, please login" }, { status: 401 });
  }
  const form = await req.formData();
  const courseId = form.get("courseId") as string;
  const file = form.get("file") as File | null;

  if (!courseId || !file) return NextResponse.json({ error: "Missing courseId or file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

  const userId = (session as any).userId || (session.user as any).id;
  const userEmail = (session.user as any).email;

  // Try upload to Vercel Blob if token exists, else use base64 preview
  let url: string | null = null;
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`paymentProofs/${Date.now()}-${file.name}`, file, { access: "public" });
      url = blob.url;
    } else {
      // fallback: create object URL placeholder (store as blob not possible, store name)
      url = `local://payments/${file.name}`;
    }
  } catch (e) {
    console.warn("Blob upload failed", e);
    url = `local://payments/${file.name}`;
  }

  // Try save to DB, else memory
  if (process.env.DATABASE_URL) {
    try {
      // find course price via DB or mock
      let amount = 0;
      try {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (course) amount = course.price;
      } catch {}
      // mock price if not found
      if (amount === 0) {
        // fallback mock mapping
        const mockPrices: Record<string, number> = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 49.99, c6: 39.99 };
        amount = mockPrices[courseId] ?? 0;
      }

      // Ensure user exists in DB (may be fallback user)
      let dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: { email: userEmail, name: (session.user as any).name || "User", role: (session.user as any).role === "ADMIN" ? "ADMIN" : "STUDENT" },
        });
      }

      // Ensure course exists
      let dbCourse = await prisma.course.findUnique({ where: { id: courseId } });
      if (!dbCourse) {
        // create mock course stub
        dbCourse = await prisma.course.create({
          data: {
            id: courseId,
            title: `Course ${courseId}`,
            slug: `course-${courseId}-${Date.now()}`,
            description: "Auto-created stub for payment",
            price: amount,
            thumbnail: "",
            level: "BEGINNER",
          },
        });
      }

      const payment = await prisma.payment.create({
        data: {
          userId: dbUser.id,
          courseId: dbCourse.id,
          amount,
          proofImageUrl: url,
          status: "PENDING",
        },
      });
      return NextResponse.json({ ok: true, payment });
    } catch (e: any) {
      console.error("DB payment save failed", e);
      // fallthrough to memory
    }
  }

  // Memory fallback
  const entry = {
    id: `mem_${Date.now()}`,
    userId,
    userEmail,
    courseId,
    proofImageUrl: url,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  global.__payments!.push(entry);
  return NextResponse.json({ ok: true, payment: entry, note: "Stored in memory (no DATABASE_URL)" });
}

export async function GET() {
  // For admin to list - check auth outside, but provide fallback memory list
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (process.env.DATABASE_URL) {
    try {
      const payments = await prisma.payment.findMany({ include: { user: true, course: true }, orderBy: { createdAt: "desc" }, take: 50 });
      return NextResponse.json(payments);
    } catch (e) {
      console.warn(e);
    }
  }
  return NextResponse.json(global.__payments || []);
}
