"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">TutorLink</h1>
      <p className="text-gray-600 mb-8">Connecting students and tutors effortlessly</p>
      <div className="flex space-x-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push("/account")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}