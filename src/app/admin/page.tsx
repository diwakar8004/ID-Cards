import { Users, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [
    totalUsers,
    pendingApplications,
    activeIds,
    rejectedApplications,
    recentUsers
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: UserStatus.PENDING }),
    User.countDocuments({ status: UserStatus.ACTIVE }),
    User.countDocuments({ status: UserStatus.REJECTED }),
    User.find().sort({ createdAt: -1 }).limit(5).lean()
  ]);

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
        <p className="text-sm text-ink-secondary">Overview of HACKER गोवा HOUSE Builder Passes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-base p-6 flex items-start gap-4">
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

      <div className="card-base overflow-hidden">
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-ink">Recent Applications</h2>
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
                    No applications yet.
                  </td>
                </tr>
              ) : (
                recentUsers.map((user: any) => (
                  <tr key={user._id.toString()} className="hover:bg-canvas transition-fast">
                    <td className="px-6 py-4 font-medium text-ink">{user.fullName}</td>
                    <td className="px-6 py-4 text-ink-secondary">{user.designation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.status === UserStatus.PENDING ? "bg-status-pending-bg text-status-pending" :
                        user.status === UserStatus.ACTIVE ? "bg-status-active-bg text-status-active" :
                        user.status === UserStatus.REJECTED ? "bg-status-rejected-bg text-status-rejected" :
                        "bg-surface-raised text-ink-secondary"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-ink-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
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
