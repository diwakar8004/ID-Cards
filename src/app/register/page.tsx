"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { registrationSchema } from "@/lib/validation";
import { OrganizationType } from "@/types";

type ClientRegistrationFormData = z.infer<typeof registrationSchema>;

// ── Small reusable field group ──────────────────────────────

function FormField({
  label,
  error,
  children,
  note,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="section-label block">{label}</label>
      {children}
      {note && <p className="text-xs text-ink-secondary mt-1">{note}</p>}
      {error && (
        <p className="text-xs font-medium mt-1" style={{ color: "var(--pink)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientRegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: "HACKER गोवा HOUSE",
      organizationType: OrganizationType.ORGANIZATION,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size must be under 5MB.");
      return;
    }
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ClientRegistrationFormData) => {
    setSubmitError(null);
    if (!photo) {
      setPhotoError("A clear ID photo is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      formData.append("photo", photo);

      const res = await fetch("/api/register", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setSubmitError(result.error || "Failed to submit application.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const token = result.data?.verificationToken;
      if (token) {
        router.push(`/card/${token}`);
      } else {
        router.push("/");
      }
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-paper paper-texture pb-24">

      {/* ── Header ── */}
      <header className="bg-paper border-b border-divider sticky top-0 z-40">
        <div className="section-container">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <ArrowLeft className="w-3.5 h-3.5 text-ink-secondary group-hover:text-forest transition-fast" />
              <span className="section-label group-hover:text-forest transition-fast">
                HACKER गोवा HOUSE
              </span>
            </Link>
            <span className="section-label">PASS APPLICATION FORM</span>
          </div>
        </div>
      </header>

      <div className="section-container pt-12 lg:pt-16">

        {/* ── Page title ── */}
        <div className="border-b border-divider pb-8 mb-12 grid lg:grid-cols-[2fr_1fr] gap-8 items-end">
          <div>
            <p className="section-label mb-3">— APPLY FOR YOUR PASS</p>
            <h1 className="font-heading font-black text-near-black uppercase tracking-tight leading-none text-[clamp(2rem,6vw,3.5rem)]">
              Builder Pass
              <br />
              <span className="text-forest">Application</span>
            </h1>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Fill in your details accurately. Your photo will appear on the physical pass card.
          </p>
        </div>

        {/* ── Error banner ── */}
        {submitError && (
          <div
            className="mb-10 p-4 border flex items-start gap-3 animate-fade-in"
            style={{ borderColor: "var(--pink)", backgroundColor: "var(--status-revoked-bg)" }}
          >
            <span className="font-mono text-xs mt-0.5" style={{ color: "var(--pink)" }}>ERR</span>
            <p className="text-sm font-medium" style={{ color: "var(--pink)" }}>{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-2xl space-y-16">

            {/* ── 01 PHOTO ── */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-ink-secondary">01</span>
                <span className="rule flex-1" />
                <span className="section-label">YOUR PHOTO</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex-shrink-0 w-32 h-36 border-2 border-dashed overflow-hidden transition-base group"
                  style={{
                    borderColor: photoError ? "var(--pink)" : "var(--divider)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-ink-secondary group-hover:text-forest transition-fast gap-2">
                      <UploadCloud className="w-6 h-6" />
                      <span className="section-label">UPLOAD</span>
                    </div>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                />

                <div className="flex-1 space-y-3">
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    This photo appears on your official Builder Pass card. Use a clear,
                    front-facing photo with a plain or neutral background.
                  </p>
                  <ul className="space-y-1">
                    {["JPG, PNG, or WEBP", "Max 5MB", "Plain background preferred"].map(t => (
                      <li key={t} className="flex gap-2 text-xs text-ink-secondary">
                        <span className="text-forest">—</span>{t}
                      </li>
                    ))}
                  </ul>
                  {photoError && (
                    <p className="text-xs font-medium" style={{ color: "var(--pink)" }}>{photoError}</p>
                  )}
                  {photoPreview && (
                    <button
                      type="button"
                      className="section-label hover:text-pink transition-fast mt-2"
                      style={{ color: "var(--ink-secondary)" }}
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── 02 IDENTITY ── */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-ink-secondary">02</span>
                <span className="rule flex-1" />
                <span className="section-label">YOUR IDENTITY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <FormField label="FIRST NAME" error={errors.firstName?.message}>
                  <input
                    {...register("firstName")}
                    className={`form-field ${errors.firstName ? "field-error" : ""}`}
                    placeholder="Aarav"
                  />
                </FormField>

                <FormField label="LAST NAME" error={errors.lastName?.message}>
                  <input
                    {...register("lastName")}
                    className={`form-field ${errors.lastName ? "field-error" : ""}`}
                    placeholder="Sharma"
                  />
                </FormField>

                <FormField label="EMAIL ADDRESS" error={errors.email?.message}>
                  <input
                    type="email"
                    {...register("email")}
                    className={`form-field ${errors.email ? "field-error" : ""}`}
                    placeholder="you@example.com"
                  />
                </FormField>

                <FormField label="PHONE NUMBER" error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    className={`form-field ${errors.phone ? "field-error" : ""}`}
                    placeholder="+91 98765 43210"
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="CURRENT ADDRESS" error={errors.address?.message}>
                    <textarea
                      {...register("address")}
                      className={`form-field ${errors.address ? "field-error" : ""} resize-none`}
                      rows={2}
                      placeholder="Panaji, Goa, India"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ── 03 BUILDER PROFILE ── */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-ink-secondary">03</span>
                <span className="rule flex-1" />
                <span className="section-label">YOUR BUILDER PROFILE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <div className="sm:col-span-2">
                  <FormField
                    label="STARTUP / AFFILIATION"
                    error={errors.organizationName?.message}
                    note="Leave as default if you are an independent community member."
                  >
                    <input
                      {...register("organizationName")}
                      className={`form-field ${errors.organizationName ? "field-error" : ""}`}
                    />
                  </FormField>
                </div>

                <FormField label="ROLE / DESIGNATION" error={errors.designation?.message}>
                  <input
                    {...register("designation")}
                    className={`form-field ${errors.designation ? "field-error" : ""}`}
                    placeholder="Founder, Developer, Designer…"
                  />
                </FormField>

                <FormField label="PRIMARY FOCUS" error={errors.department?.message}>
                  <input
                    {...register("department")}
                    className={`form-field ${errors.department ? "field-error" : ""}`}
                    placeholder="Engineering, Design, Growth…"
                  />
                </FormField>
              </div>
            </div>

            {/* ── SUBMIT ── */}
            <div className="pt-4 border-t border-divider">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary group disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    GENERATE MY BUILDER PASS
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
