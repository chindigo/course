import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

declare global {
  var __payments: any[] | undefined;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (process.env.DATABASE_URL) {
    try {
      const payments = await prisma.payment.findMany({ include: { user: true, course: true }, orderBy: { createdAt: "desc" } });
      return NextResponse.json(payments);
    } catch {}
  }
  return NextResponse.json(global.__payments || []);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { id, status, adminNote } = body;
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (process.env.DATABASE_URL) {
    try {
      const updated = await prisma.payment.update({ where: { id }, data: { status, adminNote } });
      // If approved, create enrollment
      if (status === "APPROVED") {
        const p = updated as any;
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: p.userId, courseId: p.courseId } },
          update: {},
          create: { userId: p.userId, courseId: p.courseId, progress: 0 },
        });
      }
      return NextResponse.json(updated);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  // memory fallback
  if (!global.__payments) global.__payments = [];
  const idx = global.__payments.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  global.__payments[idx].status = status;
  global.__payments[idx].adminNote = adminNote;
  return NextResponse.json(global.__payments[idx]);
}
