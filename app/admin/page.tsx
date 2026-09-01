"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;
  const [tab, setTab] = useState<"overview" | "payments" | "accounts" | "courses">("overview");
  const [payments, setPayments] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [newAcc, setNewAcc] = useState({ title: "", bankName: "", accountNumber: "", holderName: "", instructions: "" });
  const [newCourse, setNewCourse] = useState({ title: "", description: "", price: "0", level: "BEGINNER", duration: "04 WEEKS" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && role !== "ADMIN") router.push("/dashboard");
  }, [status, role, router]);

  useEffect(() => {
    if (role === "ADMIN") {
      fetch("/api/admin/payments").then((r) => r.json()).then((d) => Array.isArray(d) && setPayments(d));
      fetch("/api/admin/payment-accounts").then((r) => r.json()).then((d) => Array.isArray(d) && setAccounts(d));
      fetch("/api/admin/courses").then((r) => r.json()).then((d) => Array.isArray(d) && setCourses(d));
    }
  }, [role, tab]);

  async function approve(id: string, approve: boolean) {
    const res = await fetch("/api/admin/payments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: approve ? "APPROVED" : "REJECTED", adminNote: approve ? "Approved by admin" : "Rejected - proof unclear" }) });
    if (res.ok) {
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: approve ? "APPROVED" : "REJECTED" } : p)));
    }
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/payment-accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newAcc) });
    if (res.ok) {
      const acc = await res.json();
      setAccounts((prev) => [acc, ...prev]);
      setNewAcc({ title: "", bankName: "", accountNumber: "", holderName: "", instructions: "" });
    }
  }

  async function deleteAccount(id: string) {
    await fetch(`/api/admin/payment-accounts?id=${id}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCourse) });
    if (res.ok) {
      const c = await res.json();
      setCourses((prev) => [c, ...prev]);
      setNewCourse({ title: "", description: "", price: "0", level: "BEGINNER", duration: "04 WEEKS" });
    }
  }

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;
  if (role !== "ADMIN") return null;

  const pending = payments.filter((p) => p.status === "PENDING").length;
  const approved = payments.filter((p) => p.status === "APPROVED").length;
  const totalSales = payments.filter((p) => p.status === "APPROVED").reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 mb-4">Manage courses, payment accounts, and review payment proofs</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setTab("overview")} className={`px-4 py-2 rounded text-sm ${tab === "overview" ? "bg-blue-600 text-white" : "border"}`}>Overview</button>
        <button onClick={() => setTab("payments")} className={`px-4 py-2 rounded text-sm ${tab === "payments" ? "bg-blue-600 text-white" : "border"}`}>Payments ({pending} pending)</button>
        <button onClick={() => setTab("accounts")} className={`px-4 py-2 rounded text-sm ${tab === "accounts" ? "bg-blue-600 text-white" : "border"}`}>Payment Accounts ({accounts.length})</button>
        <button onClick={() => setTab("courses")} className={`px-4 py-2 rounded text-sm ${tab === "courses" ? "bg-blue-600 text-white" : "border"}`}>Courses ({courses.length})</button>
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border"><div className="text-xs text-gray-500">Total Courses</div><div className="text-2xl font-black">{courses.length}</div></div>
          <div className="bg-white p-4 rounded-xl border"><div className="text-xs text-gray-500">Pending Payments</div><div className="text-2xl font-black text-yellow-600">{pending}</div></div>
          <div className="bg-white p-4 rounded-xl border"><div className="text-xs text-gray-500">Approved Sales</div><div className="text-2xl font-black text-green-600">{approved}</div></div>
          <div className="bg-white p-4 rounded-xl border"><div className="text-xs text-gray-500">Total Sales</div><div className="text-2xl font-black">${totalSales.toFixed(2)}</div></div>
          <div className="md:col-span-4 bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-2">Analytics</h3>
            <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">Sales chart — integrate Recharts with DB data (pending → approved over time)</div>
            <p className="text-xs text-gray-500 mt-2">Use this panel to track enrollments, sales, and issue certificates. (Charts populated when Vercel Postgres has data)</p>
          </div>
        </div>
      )}

      {tab === "payments" && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b font-bold text-sm">User Payment Proofs — Click to view image, then Approve/Reject</div>
          {payments.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">No payments yet. Students will appear here after checkout uploads.</div>
          ) : (
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="p-4 flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <div className="font-bold text-sm">{p.course?.title || p.courseId} — ${p.amount ?? 0}</div>
                    <div className="text-xs text-gray-500">User: {p.user?.email || p.userEmail || p.userId} • {new Date(p.createdAt).toLocaleString()}</div>
                    <div className="text-xs mt-1">Proof: {p.proofImageUrl?.startsWith("local://") ? <span className="text-gray-400">Local preview ({p.proofImageUrl}) — configure BLOB_READ_WRITE_TOKEN for real storage</span> : <a href={p.proofImageUrl} target="_blank" className="text-blue-600 underline">View Image →</a>}</div>
                    {p.proofImageUrl && !p.proofImageUrl.startsWith("local://") && <img src={p.proofImageUrl} alt="proof" className="mt-2 h-32 border rounded object-contain" />}
                    {p.adminNote && <div className="text-xs mt-1">Note: {p.adminNote}</div>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-center ${p.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : p.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                    {p.status === "PENDING" && (
                      <>
                        <button onClick={() => approve(p.id, true)} className="bg-green-600 text-white px-4 py-1 rounded text-xs">Approve & Enroll</button>
                        <button onClick={() => approve(p.id, false)} className="bg-red-600 text-white px-4 py-1 rounded text-xs">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "accounts" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Create Payment Account (where you receive money)</h3>
            <p className="text-xs text-gray-500 mb-3">Admin uploads account info here. Students see this at checkout and must upload proof after paying.</p>
            <form onSubmit={createAccount} className="space-y-3 text-sm">
              <input placeholder="Title e.g. Commercial Bank of Ethiopia" value={newAcc.title} onChange={(e) => setNewAcc({ ...newAcc, title: e.target.value })} className="w-full border rounded px-3 py-2" required />
              <input placeholder="Bank Name e.g. CBE" value={newAcc.bankName} onChange={(e) => setNewAcc({ ...newAcc, bankName: e.target.value })} className="w-full border rounded px-3 py-2" />
              <input placeholder="Account Number" value={newAcc.accountNumber} onChange={(e) => setNewAcc({ ...newAcc, accountNumber: e.target.value })} className="w-full border rounded px-3 py-2" required />
              <input placeholder="Holder Name" value={newAcc.holderName} onChange={(e) => setNewAcc({ ...newAcc, holderName: e.target.value })} className="w-full border rounded px-3 py-2" required />
              <textarea placeholder="Instructions for students" value={newAcc.instructions} onChange={(e) => setNewAcc({ ...newAcc, instructions: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Add Account</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Existing Accounts</h3>
            {accounts.map((a) => (
              <div key={a.id} className="border rounded p-3 mb-2 text-sm">
                <div className="font-bold">{a.title} — {a.bankName}</div>
                <div className="text-xs">Acc: {a.accountNumber} • Holder: {a.holderName}</div>
                <div className="text-xs text-gray-500">{a.instructions}</div>
                <button onClick={() => deleteAccount(a.id)} className="text-xs text-red-600 mt-1">Delete</button>
              </div>
            ))}
            {accounts.length === 0 && <div className="text-xs text-gray-400">No accounts yet.</div>}
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Upload Course Materials</h3>
            <form onSubmit={createCourse} className="space-y-3 text-sm">
              <input placeholder="Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="w-full border rounded px-3 py-2" required />
              <textarea placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Price e.g. 49.99" value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} className="border rounded px-3 py-2" />
                <select value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })} className="border rounded px-3 py-2"><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option></select>
              </div>
              <input placeholder="Duration e.g. 04 WEEKS" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} className="border rounded px-3 py-2" />
              <input placeholder="Thumbnail URL (or leave blank for upload via Blob)" className="w-full border rounded px-3 py-2 text-xs" disabled />
              <input type="file" accept="video/*,image/*,.pdf" className="w-full border rounded p-2 text-xs" />
              <div className="text-[11px] text-gray-400">Video upload: supports YouTube URL or direct file upload to Vercel Blob (configure BLOB_READ_WRITE_TOKEN). For now use thumbnail URL.</div>
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Create Course</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold text-sm mb-3">Existing Courses</h3>
            <div className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="border rounded p-3 flex gap-3 text-sm">
                  <img src={c.thumbnail || "https://via.placeholder.com/80"} alt="" className="h-12 w-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-bold line-clamp-1">{c.title}</div>
                    <div className="text-xs text-gray-500">${c.price ?? 0} • {c.level || "BEGINNER"}</div>
                    <Link href={`/courses/${c.slug}`} className="text-xs text-blue-600">View →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400">Tip: All data here persists to Vercel Postgres when DATABASE_URL is set. Without DB, data is in-memory demo (resets on redeploy).</div>
    </div>
  );
}
