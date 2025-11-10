"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUrl(`${window.location.origin}/login`);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) return;

      const userId = session.user.id;

      // 🔹 Check if user exists in 'users' table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(fetchError);
        return;
      }

      // 🔹 If user does not exist, create one
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: userId,
          email: session.user.email,
          name: session.user.email,
          role: null,
        });

        if (insertError) console.error(insertError);
      }

      // 🔹 Get updated user data
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      // 🔹 Redirect based on role
      if (!user?.role) {
        router.push("/profile-setup"); // 👈 NEW: go to profile setup page
      } else if (user.role === "student") {
        router.push("/student/dashboard");
      } else if (user.role === "tutor") {
        router.push("/tutor/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {redirectUrl && (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={redirectUrl}
        />
      )}
    </div>
  );
}