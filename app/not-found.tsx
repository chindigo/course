import Link from "next/link";
export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-black">Not Found</h1>
      <p className="text-sm text-gray-500 mt-2">The page you are looking for does not exist.</p>
      <Link href="/" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded">Go Home</Link>
    </div>
  );
}
