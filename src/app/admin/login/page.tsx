"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-accent-navy flex items-center justify-center transition-base group-hover:scale-105">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-ink text-xl tracking-tight uppercase">
              HACKER गोवा HOUSE
            </span>
          </Link>
        </div>

        <div className="card-base p-8 sm:p-10 shadow-sm animate-fade-in-up">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl text-ink font-bold mb-2">
              Admin Gateway
            </h2>
            <p className="text-sm text-ink-secondary">
              Sign in to manage Builder Social Cards
            </p>
          </div>

          {reason === "session_expired" && (
            <div className="mb-6 p-4 bg-status-expired-bg border border-status-expired/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-status-expired shrink-0 mt-0.5" />
              <p className="text-sm text-status-expired font-medium">
                Your session has expired. Please log in again.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-status-revoked-bg border border-status-revoked/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-status-revoked shrink-0 mt-0.5" />
              <p className="text-sm text-status-revoked font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ink">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hackergoa.com"
                {...register("email")}
                className={errors.email ? "border-status-revoked" : ""}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-status-revoked mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-ink">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-status-revoked" : ""}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs text-status-revoked mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-navy hover:bg-blue-700 text-white btn-tactile h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-navy" /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
