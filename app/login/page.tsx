"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("student@edura.com");
  const [password, setPassword] = useState("Student123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow border">
        <h1 className="text-2xl font-black mb-2">Welcome Back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to continue learning</p>
        <div className="bg-blue-50 text-xs p-3 rounded mb-4">
          Demo accounts:<br />
          <b>Student:</b> student@edura.com / Student123!<br />
          <b>Admin:</b> admin@edura.com / Admin123!
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2 text-sm" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded px-3 py-2 text-sm" required />
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          <button disabled={loading} className="w-full bg-[#0166FF] text-white py-2 rounded font-bold text-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-center mt-4">No account? <Link href="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}
