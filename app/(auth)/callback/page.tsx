"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

function parseHashTokens(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const access_token = params.get("access_token") ?? undefined;
  const refresh_token = params.get("refresh_token") ?? undefined;
  return { access_token, refresh_token };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [status, setStatus] = useState("Confirming your account...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setStatus("Configuration required");
      return;
    }

    const next = searchParams.get("next") ?? "dashboard";
    const code = searchParams.get("code");

    const handleSession = async () => {
      try {
        const hashTokens = parseHashTokens(window.location.hash);

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (hashTokens.access_token && hashTokens.refresh_token) {
          const { error: setError } = await supabase.auth.setSession({
            access_token: hashTokens.access_token,
            refresh_token: hashTokens.refresh_token,
          });
          if (setError) throw setError;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const session = sessionData.session;

        if (!session) {
          setStatus("Confirmed, but you need to sign in.");
          setError("We couldn't start a session. Please log in and retry checkout.");
          return;
        }

        if (next === "checkout") {
          setStatus("Launching checkout...");
          const response = await fetch("/api/stripe/create-checkout-session", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (response.ok) {
            const { url } = (await response.json()) as { url?: string };
            if (url) {
              window.location.href = url;
              return;
            }
          }

          setError("We confirmed your email, but couldn't start checkout. Please sign in and try again.");
          setStatus("Checkout unavailable");
          return;
        }

        router.replace("/dashboard");
      } catch (err: any) {
        console.error("Auth callback error", err);
        setError(err?.message ?? "Unable to complete confirmation.");
        setStatus("There was a problem confirming your account.");
      }
    };

    handleSession();
  }, [supabase, searchParams, router]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg space-y-4 text-center">
        <div>
          <p className="text-sm text-white/60">Deadhead Zero</p>
          <h1 className="text-2xl font-semibold">{status}</h1>
        </div>
        {error ? <p className="text-sm text-rose-200">{error}</p> : <p className="text-sm text-white/70">Please wait...</p>}
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push("/login")}>Back to login</Button>
          <Button variant="ghost" onClick={() => router.push("/register")}>Restart signup</Button>
        </div>
      </Card>
    </div>
  );
}
