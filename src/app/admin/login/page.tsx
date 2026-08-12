"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validation";
import { Suspense } from "react";

// ============================================================
// Admin Login Page
// ============================================================

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  // Extract URL params for redirecting back
  const from = searchParams.get("from") || "/admin";
  const reason = searchParams.get("reason");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error || "Login failed. Please check your credentials.");
        return;
      }

      // Successful login
      router.push(from);
      router.refresh(); // Refresh to update middleware state
    } catch (err) {
      setError(`An unexpected error occurred. Please try again. ${err instanceof Error ? err.message : ""}`);
    }
  };
  
  return (
    <main className="min-h-screen bg-paper paper-texture flex flex-col">
      {/* Header strip */}
      <div style={{ background: "var(--forest-dark)", borderBottom: "1px solid rgba(245,197,24,0.15)" }}>
        <div className="section-container">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="font-mono text-[0.65rem] uppercase tracking-widest transition-fast" style={{ color: "rgba(245,197,24,0.6)" }}>← HOME</Link>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest" style={{ color: "rgba(245,197,24,0.4)" }}>ADMIN GATEWAY</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-16 px-4">
        <div className="w-full max-w-sm mx-auto">

          {reason === "session_expired" && (
            <div className="mb-6 p-3 border flex items-start gap-3" style={{ borderColor: "var(--status-expired)", backgroundColor: "var(--status-expired-bg)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--status-expired)" }}>
                Session expired — please sign in again.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 border flex items-start gap-3" style={{ borderColor: "var(--accent-red)", backgroundColor: "var(--status-revoked-bg)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--accent-red)" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
              <div>
                <label className="section-label block mb-1.5 text-muted-green">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@hackergoa.com"
                  {...register("email")}
                  className={`form-field ${errors.email ? "field-error" : ""}`}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs mt-1 font-medium text-accent-red">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="section-label block mb-1.5 text-muted-green">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`form-field ${errors.password ? "field-error" : ""}`}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-xs mt-1 font-medium text-accent-red">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</>
                ) : (
                  "SIGN IN →"
                )}
              </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--forest)" }}><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--yellow)" }} /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
