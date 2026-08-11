import { Suspense } from "react";
import { Shield, Loader2 } from "lucide-react";
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
    <div className="bg-deep-green h-screen flex items-center justify-center">
      <div className="text-center text-warm-cream">
        <Shield className="w-16 h-16 mx-auto mb-6 text-accent-red" />
        <h1 className="font-heading font-black text-3xl uppercase text-accent-red mb-4">
          PASS NOT FOUND
        </h1>
        <p className="text-sm text-muted-green mb-8">
          The requested Builder Social Card could not be found.
        </p>
        <Link href="/" className="btn-secondary">
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-paper">
      {/* Left editorial panel — 50% */}
      <div className="w-full lg:w-1/2">
        <LeftPanel />
      </div>

      {/* Right pass preview panel — 50% dark green stage */}
      <div className="w-full lg:w-1/2">
        <RightPanel user={user} />
      </div>
    </div>
  );
}

function CardLoading() {
  return (
    <div className="bg-deep-green h-screen flex items-center justify-center">
      <div className="text-center text-warm-cream">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-accent-gold" />
          <span className="section-label text-accent-gold">GENERATING YOUR PASS…</span>
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
    <main className="min-h-screen bg-paper">
      {/* Top navigation strip */}
      <div className="border-b border-divider bg-paper">
        <div className="section-container">
          <div className="h-14 flex items-center justify-between">
            <span className="section-label">HACKER गोवा HOUSE / PASS STUDIO</span>
            <Link
              href="/"
              className="section-label hover:text-forest transition-fast"
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
