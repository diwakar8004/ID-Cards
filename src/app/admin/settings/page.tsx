"use client";

import { useState, useEffect } from "react";
import { Shield, Database, Lock, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "error">("checking");
  const [stats, setStats] = useState<{ totalUsers: number; activeIds: number } | null>(null);

  // Check DB connection status on mount
  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setDbStatus("connected");
            setStats({
              totalUsers: json.data.totalUsers,
              activeIds: json.data.activeIds,
            });
          } else {
            setDbStatus("error");
          }
        } else if (res.status === 401) {
          setDbStatus("error");
        } else {
          setDbStatus("error");
        }
      } catch {
        setDbStatus("error");
      }
    };
    checkDb();
  }, []);

  const handleRunSeed = async () => {
    setSeedLoading(true);
    setSeedStatus(null);
    try {
      const res = await fetch("/api/admin/seed");
      const json = await res.json();
      if (json.success) {
        setSeedStatus({ type: "success", message: json.message || "Initial admin seeded successfully!" });
      } else {
        setSeedStatus({ type: "error", message: json.error || "Seed endpoint returned an error." });
      }
    } catch {
      setSeedStatus({ type: "error", message: "Failed to connect to seed endpoint." });
    } finally {
      setSeedLoading(false);
    }
  };

  const dbStatusConfig = {
    checking: { label: "Checking…", color: "text-muted-green", bg: "bg-surface-raised" },
    connected: { label: "Connected", color: "text-status-active", bg: "bg-status-active-bg" },
    error: { label: "Error", color: "text-status-rejected", bg: "bg-status-rejected-bg" },
  };

  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-deep mb-1">Admin Settings</h1>
          <p className="text-sm text-muted-green">System configuration, security, and database status.</p>
        </div>
        <Link href="/admin" className="section-label text-muted-green hover:text-accent-red transition-fast">
          ← BACK TO DASHBOARD
        </Link>
      </div>

      {/* Account Info */}
      <div className="bg-warm-cream rounded-xl border border-divider p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-divider pb-4">
          <Shield className="w-5 h-5 text-deep-green" />
          <h2 className="font-heading font-bold text-text-deep text-lg">Admin Gateway Identity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="section-label block text-muted-green mb-1">ROLES & PERMISSIONS</span>
            <span className="font-semibold text-text-deep">Super Administrator (Full Access)</span>
          </div>
          <div>
            <span className="section-label block text-muted-green mb-1">SESSION SECURITY</span>
            <span className="font-semibold text-text-deep">JWT Cookie (7-Day Expiry)</span>
          </div>
        </div>
      </div>

      {/* System & Database Status */}
      <div className="bg-warm-cream rounded-xl border border-divider p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-divider pb-4">
          <Database className="w-5 h-5 text-deep-green" />
          <h2 className="font-heading font-bold text-text-deep text-lg">System Infrastructure</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-divider">
            <div className="flex items-center gap-2.5">
              {dbStatus === "checking" ? (
                <Loader2 className="w-4 h-4 animate-spin text-deep-green" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${dbStatusConfig[dbStatus].color}`} />
              )}
              <span className="font-medium text-text-deep">MongoDB Atlas Database</span>
            </div>
            <span className={`font-mono text-xs px-2.5 py-1 rounded-full font-semibold ${dbStatusConfig[dbStatus].bg} ${dbStatusConfig[dbStatus].color}`}>
              {dbStatusConfig[dbStatus].label}
            </span>
          </div>

          {stats && (
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-divider">
              <span className="font-medium text-text-deep">Total Registered Builders</span>
              <span className="font-mono text-xs bg-accent-surface text-forest-dark px-2.5 py-1 rounded-full font-semibold">
                {stats.totalUsers}
              </span>
            </div>
          )}

          {stats && (
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-divider">
              <span className="font-medium text-text-deep">Active Passes in System</span>
              <span className="font-mono text-xs bg-status-active-bg text-status-active px-2.5 py-1 rounded-full font-semibold">
                {stats.activeIds}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-divider">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-active" />
              <span className="font-medium text-text-deep">Cloudinary Media Storage</span>
            </div>
            <span className="font-mono text-xs bg-status-active-bg text-status-active px-2.5 py-1 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-divider">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-status-active" />
              <span className="font-medium text-text-deep">Event Timeline</span>
            </div>
            <span className="font-mono text-xs text-muted-green font-semibold">
              GOA 2026 (OCT 28 – 31, 2026)
            </span>
          </div>
        </div>
      </div>

      {/* Initial Seed Utility */}
      <div className="bg-warm-cream rounded-xl border border-divider p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-divider pb-4">
          <Lock className="w-5 h-5 text-deep-green" />
          <h2 className="font-heading font-bold text-text-deep text-lg">Initial Admin Seed Utility</h2>
        </div>

        <p className="text-sm text-muted-green">
          If no admin user exists in the database, this utility provisions the initial admin account using environment variables (<code className="bg-surface px-1.5 py-0.5 rounded text-text-deep">INITIAL_ADMIN_EMAIL</code>).
        </p>
        <p className="text-xs text-muted-green">
          Note: This endpoint is only accessible when zero admin accounts exist. Once an admin is seeded, it returns 403.
        </p>

        {seedStatus && (
          <div className={`p-4 rounded-xl border text-sm flex items-center gap-3 font-medium ${
            seedStatus.type === "success"
              ? "bg-status-active-bg border-status-active text-status-active"
              : "bg-status-rejected-bg border-accent-red text-accent-red"
          }`}>
            {seedStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{seedStatus.message}</span>
          </div>
        )}

        <Button
          onClick={handleRunSeed}
          disabled={seedLoading}
          variant="outline"
          className="border-divider text-text-deep hover:bg-surface"
        >
          {seedLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying Seed Status…</>
          ) : (
            <><RefreshCw className="w-4 h-4 mr-2" /> Check / Seed Initial Admin</>
          )}
        </Button>
      </div>
    </div>
  );
}
