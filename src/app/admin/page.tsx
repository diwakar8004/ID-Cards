import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Clock, CheckCircle, XCircle, ShieldBan } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";
import { getSession } from "@/lib/auth";
import { getStatusBadgeClass, getStatusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RecentUserItem {
  id: string;
  fullName: string;
  designation: string;
  status: UserStatus;
  createdAt: string;
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login?reason=session_expired");
  }

  let totalUsers = 0;
  let pendingApplications = 0;
  let activeIds = 0;
  let expiredIds = 0;
  let revokedIds = 0;
  let rejectedApplications = 0;
  let recentUsers: RecentUserItem[] = [];
  let fetchError: string | null = null;

  try {
    await connectToDatabase();

    const [
      totalCount,
      pendingCount,
      activeCount,
      expiredCount,
      revokedCount,
      rejectedCount,
      recentDocs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: UserStatus.PENDING }),
      User.countDocuments({ status: UserStatus.ACTIVE }),
      User.countDocuments({ status: UserStatus.EXPIRED }),
      User.countDocuments({ status: UserStatus.REVOKED }),
      User.countDocuments({ status: UserStatus.REJECTED }),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    totalUsers = totalCount;
    pendingApplications = pendingCount;
    activeIds = activeCount;
    expiredIds = expiredCount;
    revokedIds = revokedCount;
    rejectedApplications = rejectedCount;

    recentUsers = recentDocs.map((doc) => ({
      id: (doc._id as { toString(): string }).toString(),
      fullName: doc.fullName || "Anonymous",
      designation: doc.designation || "Builder",
      status: (doc.status as UserStatus) || UserStatus.PENDING,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-IN") : "—",
    }));
  } catch (err) {
    console.error("[Admin Dashboard] Failed to load statistics:", err);
    fetchError = "Could not connect to MongoDB database to retrieve live metrics.";
  }

  const stats = [
    {
      title: "Total Builders",
      value: totalUsers,
      icon: Users,
      color: "text-accent-navy",
      bgColor: "bg-accent-surface",
    },
    {
      title: "Pending Approvals",
      value: pendingApplications,
      icon: Clock,
      color: "text-status-pending",
      bgColor: "bg-status-pending-bg",
    },
    {
      title: "Active Passes",
      value: activeIds,
      icon: CheckCircle,
      color: "text-status-active",
      bgColor: "bg-status-active-bg",
    },
    {
      title: "Expired",
      value: expiredIds,
      icon: Clock,
      color: "text-status-expired",
      bgColor: "bg-status-expired-bg",
    },
    {
      title: "Revoked",
      value: revokedIds,
      icon: ShieldBan,
      color: "text-status-revoked",
      bgColor: "bg-status-revoked-bg",
    },
    {
      title: "Rejected",
      value: rejectedApplications,
      icon: XCircle,
      color: "text-status-rejected",
      bgColor: "bg-status-rejected-bg",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink mb-1">Dashboard</h1>
        <p className="text-sm text-ink-secondary">
          Welcome back, <span className="font-semibold text-forest">{session.name || session.email}</span>. Overview of HACKER गोवा HOUSE Builder Passes.
        </p>
      </div>

      {fetchError && (
        <div className="p-4 border border-status-rejected-bg bg-status-rejected-bg rounded-xl text-status-rejected text-sm font-medium">
          ⚠️ {fetchError}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-base p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-secondary mb-1">{stat.title}</p>
              <h3 className="font-heading text-3xl font-bold text-ink">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Table */}
      <div className="card-base overflow-hidden shadow-sm">
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-ink">Recent Applications</h2>
          <Link href="/admin/users" className="section-label text-muted-green hover:text-forest transition-fast">
            VIEW ALL →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-raised text-xs text-ink-secondary uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-ink-secondary">
                    No applications found in database.
                  </td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-canvas transition-fast">
                    <td className="px-6 py-4 font-medium text-ink">{user.fullName}</td>
                    <td className="px-6 py-4 text-ink-secondary">{user.designation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-ink-secondary">
                      {user.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
