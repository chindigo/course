"use client";
import { useParams } from "next/navigation";
import { mockCourses } from "@/lib/data";
import { useState } from "react";
import Link from "next/link";

export default function LearnPage() {
  const { courseId } = useParams() as { courseId: string };
  const course = mockCourses.find((c) => c.id === courseId);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(33);
  const [tab, setTab] = useState<"overview" | "resources" | "discussion" | "quiz">("overview");

  if (!course) return <div className="p-10">Course not found</div>;

  const lessons = [
    { title: "Introduction & Overview", duration: "12:45", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", preview: true },
    { title: "Core Concepts Deep Dive", duration: "22:10", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Hands-on Project", duration: "35:00", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-4 gap-4">
      {/* Playlist */}
      <div className="lg:col-span-1 bg-white rounded-xl border p-4 h-fit">
        <h3 className="font-bold text-sm mb-3">{course.title}</h3>
        <div className="text-xs text-gray-500 mb-3">Progress: {progress}%</div>
        <div className="bg-gray-100 h-2 rounded mb-4"><div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }} /></div>
        <div className="space-y-2">
          {lessons.map((l, i) => (
            <button key={i} onClick={() => { setActive(i); setProgress(Math.round(((i + 1) / lessons.length) * 100)); }} className={`w-full text-left border rounded p-3 text-sm ${active === i ? "bg-blue-50 border-blue-600" : ""}`}>
              <div className="font-bold">{i + 1}. {l.title}</div>
              <div className="text-xs text-gray-500">{l.duration} • {l.preview ? "Preview" : "Locked"}{active === i && " • Playing"}</div>
            </button>
          ))}
        </div>
        <Link href="/dashboard" className="mt-4 block text-center border py-2 rounded text-xs">Back to Dashboard</Link>
      </div>

      {/* Player */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-black rounded-xl overflow-hidden aspect-video">
          <iframe src={lessons[active].video} className="w-full h-full" allowFullScreen title="lesson"></iframe>
        </div>

        <div className="bg-white rounded-xl border">
          <div className="flex gap-2 border-b p-2 text-sm">
            <button onClick={() => setTab("overview")} className={`px-3 py-1 rounded ${tab === "overview" ? "bg-blue-600 text-white" : ""}`}>Overview</button>
            <button onClick={() => setTab("resources")} className={`px-3 py-1 rounded ${tab === "resources" ? "bg-blue-600 text-white" : ""}`}>Resources</button>
            <button onClick={() => setTab("discussion")} className={`px-3 py-1 rounded ${tab === "discussion" ? "bg-blue-600 text-white" : ""}`}>Discussion</button>
            <button onClick={() => setTab("quiz")} className={`px-3 py-1 rounded ${tab === "quiz" ? "bg-blue-600 text-white" : ""}`}>Quiz</button>
          </div>
          <div className="p-4 text-sm">
            {tab === "overview" && <div><h4 className="font-bold">{lessons[active].title}</h4><p className="text-gray-600 mt-2">In this lesson you will learn core concepts. Mark as complete to update progress tracker.</p><button onClick={() => setProgress(100)} className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-xs">Mark Complete & Claim Certificate</button></div>}
            {tab === "resources" && <div className="space-y-2"><a href="#" className="block border p-2 rounded">📄 Worksheet - Lesson {active + 1}.pdf (Download)</a><a href="#" className="block border p-2 rounded">📄 Slides.pdf</a></div>}
            {tab === "discussion" && <div><textarea placeholder="Ask a question..." className="w-full border rounded p-2" rows={3}></textarea><button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs">Post</button><div className="mt-3 text-xs border p-2 rounded">Student: Great explanation!</div></div>}
            {tab === "quiz" && <div><div className="font-bold">Quiz: {lessons[active].title}</div><div className="mt-2 space-y-2 text-xs"><div>Q1: What is Figma used for? <br/><label><input type="radio" name="q1" /> Design</label> <label><input type="radio" name="q1" /> Cooking</label></div><button className="bg-blue-600 text-white px-3 py-1 rounded">Submit Quiz</button></div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
