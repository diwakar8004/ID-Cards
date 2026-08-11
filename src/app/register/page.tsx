"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2, UploadCloud, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { registrationSchema } from "@/lib/validation";
import { OrganizationType } from "@/types";

type ClientRegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientRegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: "HACKER गोवा HOUSE", // Defaulting to the core brand
      organizationType: OrganizationType.ORGANIZATION,
    }
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload a valid image file (JPG, PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File size must be under 5MB.");
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ClientRegistrationFormData) => {
    setSubmitError(null);
    
    if (!photo) {
      setPhotoError("A clear ID photo is required.");
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("photo", photo);

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setSubmitError(result.error || "Failed to submit application.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-canvas flex flex-col pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto card-base p-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-status-active-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-status-active" />
          </div>
          <h1 className="font-heading text-3xl text-ink font-bold mb-4">
            Application Received
          </h1>
          <p className="text-ink-secondary text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Your application for the <span className="font-medium text-ink">goa गोवा PASS</span> has been successfully submitted. Our team will review your details shortly.
          </p>
          <div className="p-6 bg-surface-raised rounded-xl text-left border border-divider mb-8">
            <h3 className="font-semibold text-ink mb-2">What happens next?</h3>
            <ul className="space-y-3 text-sm text-ink-secondary">
              <li className="flex gap-2">
                <span className="text-accent-navy font-bold">1.</span>
                Your details and photo will be verified by an admin.
              </li>
              <li className="flex gap-2">
                <span className="text-accent-navy font-bold">2.</span>
                Once approved, your official Builder Social Card will be generated.
              </li>
              <li className="flex gap-2">
                <span className="text-accent-navy font-bold">3.</span>
                You will be notified via email when your card is ready to download.
              </li>
            </ul>
          </div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-navy hover:text-blue-700 transition-fast">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas pb-24">
      {/* Header */}
      <header className="bg-surface border-b border-divider sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-accent-navy" />
            <span className="font-heading font-bold text-ink text-sm uppercase">
              HACKER गोवा HOUSE
            </span>
          </Link>
          <span className="text-xs font-medium text-ink-secondary bg-surface-raised px-2.5 py-1 rounded-md border border-divider">
            Application Form
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <h1 className="font-heading text-3xl lg:text-4xl text-ink font-bold mb-3">
            Apply for your Pass
          </h1>
          <p className="text-ink-secondary text-lg">
            Join the Builder Social Card network. Please fill out your details accurately.
          </p>
        </div>

        {submitError && (
          <div className="mb-8 p-4 bg-status-revoked-bg border border-status-revoked/20 rounded-lg flex items-start gap-3 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-status-revoked shrink-0 mt-0.5" />
            <p className="text-sm text-status-revoked font-medium">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up stagger-1">
          {/* Photo Upload Section */}
          <div className="card-base p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink border-b border-divider pb-4 mb-6">
              ID Photo
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div 
                  className={`w-32 h-32 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-surface-raised cursor-pointer transition-base ${photoError ? 'border-status-revoked border-solid' : 'border-divider border-dashed hover:border-accent-navy'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-ink-secondary">
                      <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-ink">Upload a clear photo</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  This photo will be displayed on your official Builder Social Card. 
                  Please ensure your face is clearly visible, well-lit, and directly facing the camera.
                </p>
                <ul className="text-xs text-ink-secondary space-y-1 mt-2 list-disc pl-4">
                  <li>Format: JPG, PNG, or WEBP</li>
                  <li>Max size: 5MB</li>
                  <li>Plain or neutral background preferred</li>
                </ul>
                {photoError && <p className="text-xs text-status-revoked mt-2 font-medium">{photoError}</p>}
                
                {photoPreview && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="card-base p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink border-b border-divider pb-4 mb-6">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className={errors.firstName ? "border-status-revoked" : ""}
                />
                {errors.firstName && <p className="text-xs text-status-revoked">{errors.firstName.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className={errors.lastName ? "border-status-revoked" : ""}
                />
                {errors.lastName && <p className="text-xs text-status-revoked">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-status-revoked" : ""}
                />
                {errors.email && <p className="text-xs text-status-revoked">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={errors.phone ? "border-status-revoked" : ""}
                />
                {errors.phone && <p className="text-xs text-status-revoked">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Current Address</Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  className={`min-h-[80px] resize-none ${errors.address ? "border-status-revoked" : ""}`}
                />
                {errors.address && <p className="text-xs text-status-revoked">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Professional / Builder Details */}
          <div className="card-base p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink border-b border-divider pb-4 mb-6">
              Builder Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="organizationName">Startup / Affiliation</Label>
                <Input
                  id="organizationName"
                  {...register("organizationName")}
                  className={errors.organizationName ? "border-status-revoked" : ""}
                />
                <p className="text-xs text-ink-secondary mt-1">Leave as default if applying as an independent community member.</p>
                {errors.organizationName && <p className="text-xs text-status-revoked">{errors.organizationName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Role / Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g. Founder, Developer, Designer"
                  {...register("designation")}
                  className={errors.designation ? "border-status-revoked" : ""}
                />
                {errors.designation && <p className="text-xs text-status-revoked">{errors.designation.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Primary Focus / Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Engineering, Design, Growth"
                  {...register("department")}
                  className={errors.department ? "border-status-revoked" : ""}
                />
                {errors.department && <p className="text-xs text-status-revoked">{errors.department.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-accent-navy hover:bg-blue-700 text-white btn-tactile px-8 h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
