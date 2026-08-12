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
import { PageFooter } from "@/components/Branding";

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
      <label className="section-label block text-muted-green">{label}</label>
      {children}
      {note && <p className="text-xs text-muted-green mt-1">{note}</p>}
      {error && (
        <p className="text-xs font-medium mt-1 text-accent-red">
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

  const steps = [
    { label: "submit", description: "Send your name, photo, and builder details." },
    { label: "review", description: "A human reviews your submission within 24 hours." },
    { label: "pass", description: "Your print-ready ID is generated for download." },
    { label: "verify", description: "Anyone scans the QR to confirm your pass instantly." },
  ];

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
    <main className="min-h-screen bg-paper paper-texture">
      {/* ── HEADER NAV ── */}
      <header style={{ background: "var(--forest-dark)", borderBottom: "1px solid rgba(245,197,24,0.15)" }}>
        <div className="section-container h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            style={{ color: "rgba(253,251,247,0.7)" }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest">Home</span>
          </Link>

          {/* Wordmark centre */}
          <div className="wordmark-logo font-heading font-black uppercase tracking-tight">
            <span style={{ color: "var(--yellow)", fontSize: "1.1rem" }}>HACKER</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--pink)",
                color: "#fff",
                border: "2px solid #FF85CC",
                borderRadius: "5px",
                padding: "0.1em 0.22em",
                fontSize: "0.9rem",
                fontWeight: 900,
                lineHeight: 1,
                margin: "0 0.1em",
              }}
            >
              गोवा
            </span>
            <span style={{ color: "var(--yellow)", fontSize: "1.1rem" }}>HOUSE</span>
          </div>

          <span
            className="font-mono text-[0.6rem] uppercase tracking-widest hidden sm:block"
            style={{ color: "rgba(245,197,24,0.5)" }}
          >
            Builder Pass Studio
          </span>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section
        style={{
          background: "var(--forest)",
          borderBottom: "1px solid rgba(245,197,24,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(26,128,64,0.3) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="section-container relative py-12 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="font-mono text-[0.6rem] uppercase tracking-widest px-3 py-1 rounded-sm"
                style={{
                  background: "var(--yellow)",
                  color: "var(--forest-dark)",
                  fontWeight: 700,
                }}
              >
                Builder Pass Application
              </span>
              <span
                className="font-mono text-[0.6rem] uppercase tracking-widest"
                style={{ color: "rgba(245,197,24,0.5)" }}
              >
                2:47 pm Studio
              </span>
            </div>

            <h1
              className="font-heading font-black uppercase tracking-tight leading-none"
              style={{
                color: "var(--yellow)",
                fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
              }}
            >
              Apply for your{" "}
              <span style={{ color: "var(--pink)" }}>GOA</span>{" "}
              builder pass
            </h1>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-xl"
              style={{ color: "rgba(253,251,247,0.7)" }}
            >
              Less noise. More signal. Submit your photo, claim your pass, and carry a Builder Social Card made for Hacker House Goa.
            </p>
          </div>
        </div>
      </section>

      <div className="section-container pt-12 pb-24">

        {/* ── Error banner ── */}
        {submitError && (
          <div
            className="mb-10 p-4 border flex items-start gap-3 animate-fade-in"
            style={{ borderColor: "var(--accent-red)", backgroundColor: "var(--status-revoked-bg)" }}
          >
            <span className="font-mono text-xs mt-0.5 text-accent-red">ERR</span>
            <p className="text-sm font-medium text-accent-red">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-2xl space-y-16">

            {/* ── 01 PHOTO ── */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-xs text-muted-green">01</span>
                <span className="rule flex-1" />
                <span className="section-label text-muted-green">YOUR PHOTO</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex-shrink-0 w-32 h-36 border-2 border-dashed overflow-hidden transition-base group"
                  style={{
                    borderColor: photoError ? "var(--accent-red)" : "var(--divider)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-green group-hover:text-deep-green transition-fast gap-2">
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
                  <p className="text-sm text-muted-green leading-relaxed">
                    This photo appears on your official Builder Pass card. Use a clear,
                    front-facing photo with a plain or neutral background.
                  </p>
                  <ul className="space-y-1">
                    {["JPG, PNG, or WEBP", "Max 5MB", "Plain background preferred"].map(t => (
                      <li key={t} className="flex gap-2 text-xs text-muted-green">
                        <span className="text-deep-green">—</span>{t}
                      </li>
                    ))}
                  </ul>
                  {photoError && (
                    <p className="text-xs font-medium text-accent-red">{photoError}</p>
                  )}
                  {photoPreview && (
                    <button
                      type="button"
                      className="section-label hover:text-accent-red transition-fast mt-2"
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
                <span className="font-mono text-xs text-muted-green">02</span>
                <span className="rule flex-1" />
                <span className="section-label text-muted-green">YOUR IDENTITY</span>
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
                <span className="font-mono text-xs text-muted-green">03</span>
                <span className="rule flex-1" />
                <span className="section-label text-muted-green">YOUR BUILDER PROFILE</span>
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

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-none border border-divider bg-surface p-6">
            <h2 className="font-heading text-xs uppercase tracking-[0.24em] text-muted-green mb-6">register flow</h2>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.label} className="space-y-1">
                  <p className="font-mono text-[0.72rem] lowercase tracking-[0.24em] text-deep-green">{step.label}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-none border border-divider bg-surface p-6">
            <p className="font-heading text-sm font-black uppercase tracking-tight mb-3">Less Noise. More Signal.</p>
            <p className="text-sm text-text-muted leading-relaxed">
              Submit once. Get approved once. Carry your pass into every verification moment.
            </p>
          </div>
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
