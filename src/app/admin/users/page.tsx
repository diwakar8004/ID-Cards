"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal, 
  Search, 
  CheckCircle, 
  XCircle, 
  ShieldBan,
  Loader2,
  Filter,
  AlertCircle
} from "lucide-react";
import { UserStatus } from "@/types";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getStatusBadgeClass, getStatusLabel } from "@/lib/utils";
import { IDCardExport } from "@/components/IDCardExport";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string;
  uniqueId: string | null;
  designation: string;
  department: string;
  organizationName: string;
  organizationType: string;
  issueDate: string | null;
  expiryDate: string | null;
  status: string;
  verificationToken: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
        ...(search && { search }),
        ...(statusFilter !== "ALL" && { status: statusFilter })
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);

      if (res.status === 401) {
        router.push("/admin/login?reason=session_expired");
        return;
      }

      const json = await res.json();
      
      if (json.success) {
        setUsers(json.data.data || []);
        setTotalPages(json.data.totalPages || 1);
      } else {
        setErrorMessage(json.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      setErrorMessage("Network error — failed to connect to admin server.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, fetchUsers]);

  const handleAction = async (userId: string, action: "approve" | "reject" | "revoke") => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "PATCH",
      });

      if (res.status === 401) {
        router.push("/admin/login?reason=session_expired");
        return;
      }

      const json = await res.json();
      if (json.success) {
        await fetchUsers(); // Refresh table data
      } else {
        alert(json.error || `Failed to ${action} user`);
      }
    } catch {
      alert(`An error occurred while trying to ${action} the user.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-deep mb-1">User Management</h1>
          <p className="text-sm text-muted-green">Review, approve, and manage Builder Passes.</p>
        </div>
        <Link href="/admin" className="section-label text-muted-green hover:text-accent-red transition-fast">
          ← BACK TO DASHBOARD
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 border border-status-rejected-bg bg-status-rejected-bg rounded-xl flex items-center gap-3 text-status-rejected text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-xl border border-divider shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-green" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-9 h-10 w-full border-divider focus:border-deep-green focus:ring-deep-green"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-green" />
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val || "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-10 border-divider focus:border-deep-green">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(UserStatus).map(status => (
                <SelectItem key={status} value={status}>{getStatusLabel(status)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-warm-cream rounded-xl border border-divider overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left relative">
            <thead className="bg-deep-green text-xs text-warm-cream uppercase font-semibold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Role / Dept</th>
                <th className="px-6 py-4">Unique ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-deep-green mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-green">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface transition-fast">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-divider shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-raised border border-divider shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-text-deep truncate">{user.fullName}</p>
                          <p className="text-xs text-muted-green truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-deep font-medium">{user.designation}</p>
                      <p className="text-xs text-muted-green">{user.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      {user.uniqueId ? (
                        <span className="font-mono text-xs bg-surface-raised px-2 py-1 rounded border border-divider text-text-deep">
                          {user.uniqueId}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-green">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status as UserStatus)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {actionLoadingId === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-deep-green ml-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-surface-raised rounded-md text-muted-green">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-warm-cream border-divider">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-divider" />
                            
                            {user.status === UserStatus.PENDING && (
                              <>
                                <DropdownMenuItem onClick={() => handleAction(user.id, "approve")} className="focus:bg-surface focus:text-status-active cursor-pointer">
                                  <CheckCircle className="mr-2 w-4 h-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction(user.id, "reject")} className="focus:bg-surface focus:text-status-rejected cursor-pointer">
                                  <XCircle className="mr-2 w-4 h-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}

                            {user.status === UserStatus.ACTIVE && (
                              <DropdownMenuItem onClick={() => handleAction(user.id, "revoke")} className="focus:bg-surface focus:text-status-revoked cursor-pointer">
                                <ShieldBan className="mr-2 w-4 h-4" />
                                Revoke Pass
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator className="bg-divider" />
                            <DropdownMenuItem onClick={() => setSelectedUser(user)} className="focus:bg-surface cursor-pointer">
                              View Details / ID Card
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-divider flex items-center justify-between bg-surface">
            <span className="text-sm text-muted-green">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-divider text-text-deep hover:bg-warm-cream"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-divider text-text-deep hover:bg-warm-cream"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ID Card / User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-warm-cream border-divider p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-text-deep">Builder Pass Preview</DialogTitle>
            <DialogDescription className="text-muted-green">
              View and export the official ID card for this builder.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-2 overflow-hidden">
            {selectedUser && (
              <IDCardExport
                user={{
                  fullName: selectedUser.fullName,
                  photoUrl: selectedUser.photoUrl,
                  uniqueId: selectedUser.uniqueId ?? "",
                  designation: selectedUser.designation,
                  department: selectedUser.department,
                  organizationName: selectedUser.organizationName,
                  issueDate: selectedUser.issueDate,
                  expiryDate: selectedUser.expiryDate,
                  status: selectedUser.status as UserStatus,
                }}
                verificationToken={selectedUser.verificationToken || "PENDING"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
