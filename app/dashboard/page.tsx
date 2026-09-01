"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { mockCourses } from "@/lib/data";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/payments").then((r) => r.json()).then((d) => Array.isArray(d) && setPayments(d.filter((p: any) => p.userEmail === (session?.user as any)?.email || p.user?.email === (session?.user as any)?.email)));
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;
  if (!session) return null;

  const enrolled = payments.filter((p) => p.status === "APPROVED");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-1">Welcome, {(session.user as any)?.name || session.user?.email}</h1>
      <p className="text-sm text-gray-500 mb-6">Role: {role} • {session.user?.email}</p>

      {role === "ADMIN" && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          You are Admin. <Link href="/admin" className="text-blue-600 font-bold">Go to Admin Panel →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-3">My Enrollments</h2>
            {enrolled.length === 0 ? (
              <div className="text-sm text-gray-500">No approved enrollments yet. After admin approves your payment proof, courses appear here.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {enrolled.map((p) => {
                  const course = mockCourses.find((c) => c.id === p.courseId) || { title: p.course?.title || p.courseId, slug: p.course?.slug || p.courseId, thumbnail: p.course?.thumbnail || "" };
                  return (
                    <div key={p.id} className="border rounded p-3">
                      <div className="font-bold text-sm">{course.title}</div>
                      <div className="text-xs text-green-600">✓ Approved</div>
                      <Link href={`/learn/${p.courseId}`} className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs">Continue Learning →</Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-3">My Payments</h2>
            {payments.length === 0 ? (
              <div className="text-sm text-gray-500">No payments yet. <Link href="/courses" className="text-blue-600">Browse courses</Link></div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border rounded p-3 text-sm">
                    <div>
                      <div className="font-bold">{mockCourses.find((c) => c.id === p.courseId)?.title || p.course?.title || p.courseId}</div>
                      <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()} • {p.amount ?? 0} USD</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : p.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-2">Progress Tracker</h3>
            <div className="space-y-3 text-sm">
              <div><div className="flex justify-between text-xs"><span>Overall Progress</span><span>65%</span></div><div className="bg-gray-100 h-2 rounded"><div className="bg-blue-600 h-2 rounded" style={{ width: "65%" }} /></div></div>
              <div className="text-xs text-gray-500">Keep learning! You are doing great.</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-2">Certificates</h3>
            <p className="text-xs text-gray-500">Complete a course 100% to earn certificate. Issued from Admin Dashboard.</p>
            <button className="mt-3 border px-3 py-1 rounded text-xs">View Certificates (0)</button>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-2">Community</h3>
            <p className="text-xs">Join discussions, ask questions, message instructors.</p>
            <Link href="/courses" className="text-xs text-blue-600">Go to Forums →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
