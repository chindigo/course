"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    else {
      setMsg("Registered! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow border">
        <h1 className="text-2xl font-black mb-2">Create Account</h1>
        <p className="text-sm text-gray-500 mb-6">Join Edura and start learning today</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full border rounded px-3 py-2 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2 text-sm" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)" type="password" className="w-full border rounded px-3 py-2 text-sm" required />
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          {msg && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{msg}</div>}
          <button className="w-full bg-[#0166FF] text-white py-2 rounded font-bold text-sm">Create Account</button>
        </form>
        <p className="text-xs text-center mt-4">Already have account? <Link href="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}
