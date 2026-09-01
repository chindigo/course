"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockCourses, mockPaymentAccounts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { courseId } = useParams() as { courseId: string };
  const { data: session, status } = useSession();
  const router = useRouter();
  const course = mockCourses.find((c) => c.id === courseId);
  const [selected, setSelected] = useState(mockPaymentAccounts[0]?.id);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (!course) return <div className="max-w-3xl mx-auto p-10">Course not found</div>;
  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg("Please upload payment proof image");
      return;
    }
    setLoading(true);
    setMsg("");
    const form = new FormData();
    form.append("courseId", course!.id);
    form.append("paymentAccountId", selected);
    form.append("file", file);

    const res = await fetch("/api/payments", { method: "POST", body: form });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg("Payment proof submitted! Admin will review shortly. Check Dashboard.");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setMsg(data.error || "Failed");
    }
  }

  const acc = mockPaymentAccounts.find((a) => a.id === selected);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-4">Checkout — {course.title}</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <h2 className="font-bold">1. Choose Payment Account (Admin Provided)</h2>
          <div className="space-y-2">
            {mockPaymentAccounts.map((a) => (
              <label key={a.id} className={`block border rounded p-3 cursor-pointer ${selected === a.id ? "border-blue-600 bg-blue-50" : ""}`}>
                <input type="radio" name="acc" checked={selected === a.id} onChange={() => setSelected(a.id)} className="mr-2" />
                <b>{a.title}</b> — {a.bankName} <br />
                <span className="text-xs">Acc: {a.accountNumber} • Holder: {a.holderName}</span>
              </label>
            ))}
          </div>
          {acc && (
            <div className="bg-yellow-50 p-3 rounded text-xs">
              <b>Instructions:</b> {acc.instructions}<br />
              <b>Amount to pay: {formatPrice(course.price)}</b><br />
              Copy account number: <code className="bg-white px-1">{acc.accountNumber}</code>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl border space-y-4">
          <h2 className="font-bold">2. Upload Payment Proof</h2>
          <p className="text-xs text-gray-500">After transferring, upload screenshot/photo of receipt. Admin will approve and grant access.</p>
          <input type="file" accept="image/*" onChange={onFile} className="w-full border rounded p-2 text-sm" required />
          {preview && <img src={preview} alt="preview" className="w-full h-48 object-contain border rounded" />}
          {msg && <div className={`text-sm p-2 rounded ${msg.includes("submitted") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg}</div>}
          <button disabled={loading} className="w-full bg-[#0166FF] text-white py-3 rounded font-bold text-sm">
            {loading ? "Submitting..." : "Submit Payment Proof"}
          </button>
          <div className="text-[11px] text-gray-400">Secure manual verification. Images stored via Vercel Blob (fallback to local preview if Blob not configured).</div>
        </form>
      </div>
    </div>
  );
}
