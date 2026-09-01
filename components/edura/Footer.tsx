import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-[#0F2239] text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-black text-white text-lg mb-3">◆ EDURA</div>
          <p className="text-gray-400 text-xs">Online education platform with 20k+ courses, lifetime access and community support.</p>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Quick Links</div>
          <ul className="space-y-1 text-xs">
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Support</div>
          <ul className="space-y-1 text-xs">
            <li>info@edura.com</li>
            <li>+111 (564) 568 25</li>
            <li>Mon - Sat: 8:00 - 15:00</li>
          </ul>
        </div>
        <div>
          <div className="font-bold text-white mb-3">Newsletter</div>
          <div className="flex gap-2"><input placeholder="Email" className="rounded px-3 py-2 text-xs flex-1 text-black" /><button className="bg-blue-600 text-white px-3 rounded text-xs">→</button></div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs py-4">© 2026 Edura. All rights reserved. Built for Vercel deployment.</div>
    </footer>
  );
}
