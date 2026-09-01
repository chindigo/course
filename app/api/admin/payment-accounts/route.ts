import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

declare global {
  var __paymentAccounts: any[] | undefined;
}
if (!global.__paymentAccounts) {
  global.__paymentAccounts = [
    { id: "pa1", title: "Commercial Bank of Ethiopia", bankName: "CBE", accountNumber: "1000123456789", holderName: "EDURA LEARNING PLC", instructions: "Transfer exact amount and upload receipt.", isActive: true, createdAt: new Date().toISOString() },
    { id: "pa2", title: "TeleBirr", bankName: "TeleBirr", accountNumber: "0912345678", holderName: "EDURA LEARNING", instructions: "Send via TeleBirr and upload screenshot.", isActive: true, createdAt: new Date().toISOString() },
  ];
}

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === "ADMIN";
}

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const accounts = await prisma.paymentAccount.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json(accounts);
    } catch {}
  }
  return NextResponse.json(global.__paymentAccounts);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { title, bankName, accountNumber, holderName, instructions } = body;
  if (!title || !accountNumber || !holderName) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (process.env.DATABASE_URL) {
    try {
      const acc = await prisma.paymentAccount.create({ data: { title, bankName, accountNumber, holderName, instructions, isActive: true } });
      return NextResponse.json(acc);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  const entry = { id: `pa_${Date.now()}`, title, bankName, accountNumber, holderName, instructions, isActive: true, createdAt: new Date().toISOString() };
  global.__paymentAccounts!.push(entry);
  return NextResponse.json(entry);
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (process.env.DATABASE_URL) {
    try {
      const acc = await prisma.paymentAccount.update({ where: { id }, data });
      return NextResponse.json(acc);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  const idx = global.__paymentAccounts!.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  global.__paymentAccounts![idx] = { ...global.__paymentAccounts![idx], ...data };
  return NextResponse.json(global.__paymentAccounts![idx]);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (process.env.DATABASE_URL) {
    try {
      await prisma.paymentAccount.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  global.__paymentAccounts = global.__paymentAccounts!.filter((a) => a.id !== id);
  return NextResponse.json({ ok: true });
}
