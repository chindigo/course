export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-4">Contact Us</h1>
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <p className="text-sm text-gray-600">We’d love to hear from you. Send us a message.</p>
        <input placeholder="Name" className="w-full border rounded px-3 py-2 text-sm" />
        <input placeholder="Email" className="w-full border rounded px-3 py-2 text-sm" />
        <textarea placeholder="Message" rows={4} className="w-full border rounded px-3 py-2 text-sm"></textarea>
        <button className="bg-[#0166FF] text-white px-6 py-2 rounded font-bold text-sm">Send Message</button>
        <div className="text-xs text-gray-500">Or email: info@edura.com • Phone: +111 (564) 568 25</div>
      </div>
    </div>
  );
}
