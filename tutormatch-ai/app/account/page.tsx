"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Listen for changes
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-zinc-50 dark:bg-black text-black dark:text-white px-4">
      {session ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
          <p className="mb-6">You are already logged in as {session.user.email}</p>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Welcome!</h1>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push("/signup")}
            >
              Create an Account
            </button>
            <button
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
          </div>
        </>
      )}
    </div>
  );
}