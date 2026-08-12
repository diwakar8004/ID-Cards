import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LeftPanel, RightPanel } from "@/components/CardLayout";
import { UserStatus } from "@/types";

interface CardPageProps {
  params: Promise<{ token: string }>;
}

interface CardData {
  fullName: string;
  photoUrl: string;
  uniqueId: string;
  organizationName: string;
  organizationType: string;
  department: string;
  designation: string;
  issueDate: string | null;
  expiryDate: string | null;
  status: UserStatus;
  verificationToken: string;
}

function CardNotFound() {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(175deg, #073D1E 0%, #051F10 100%)" }}
    >
      <div className="text-center px-6">
        {/* Hot-pink X icon stand-in */}
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-full"
          style={{
            width: "64px", height: "64px",
            background: "rgba(233,30,140,0.12)",
            border: "1.5px solid rgba(233,30,140,0.35)",
          }}
        >
          <span style={{ fontSize: "28px", color: "#E91E8C", fontWeight: 900, lineHeight: 1 }}>✕</span>
        </div>
        <h1
          className="font-heading font-black uppercase tracking-tight mb-4"
          style={{ color: "#E91E8C", fontSize: "clamp(1.8rem, 6vw, 3rem)" }}
        >
          PASS NOT FOUND
        </h1>
        <p
          className="text-sm mb-8 max-w-xs mx-auto"
          style={{ color: "rgba(253,251,247,0.5)" }}
        >
          The requested Builder Social Card could not be found.
        </p>
        <Link href="/" className="btn-festival">
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}

async function CardContent({ token }: { token: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/card/${token}`,
    { next: { tags: [`card-${token}`] } }
  );

  if (!res.ok) {
    return <CardNotFound />;
  }

  const { data: user } = (await res.json()) as { data: CardData };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left editorial panel */}
      <div className="w-full lg:w-1/2">
        <LeftPanel />
      </div>
      {/* Right tropical stage */}
      <div className="w-full lg:w-1/2">
        <RightPanel user={user} />
      </div>
    </div>
  );
}

function CardLoading() {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(175deg, #073D1E 0%, #051F10 100%)" }}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#F5C518" }} />
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "rgba(245,197,24,0.6)" }}
          >
            GENERATING YOUR PASS…
          </span>
        </div>
      </div>
    </div>
  );
}

async function CardPageInner({ tokenPromise }: { tokenPromise: Promise<string> }) {
  const token = await tokenPromise;
  return <CardContent token={token} />;
}

export default function CardPage({ params }: CardPageProps) {
  const token = params.then((p) => p.token);

  return (
    <main className="min-h-screen" style={{ background: "var(--forest-dark)" }}>
      {/* Top navigation strip */}
      <div style={{ background: "var(--forest-dark)", borderBottom: "1px solid rgba(245,197,24,0.12)" }}>
        <div className="section-container">
          <div className="h-14 flex items-center justify-between">
            <span
              className="font-mono text-[0.6rem] uppercase tracking-widest"
              style={{ color: "rgba(245,197,24,0.45)" }}
            >
              HACKER गोवा HOUSE / PASS STUDIO
            </span>
            <Link
              href="/"
              className="font-mono text-[0.6rem] uppercase tracking-widest transition-fast footer-nav-link"
            >
              HOME
            </Link>
          </div>
        </div>
      </div>

      <div className="min-h-screen">
        <Suspense fallback={<CardLoading />}>
          <CardPageInner tokenPromise={token} />
        </Suspense>
      </div>
    </main>
  );
}
