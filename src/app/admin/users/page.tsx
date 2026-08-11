"use client";

import { useState, useEffect } from "react";
import { 
  MoreHorizontal, 
  Search, 
  CheckCircle, 
  XCircle, 
  ShieldBan,
  Loader2,
  Filter
} from "lucide-react";
import { UserStatus } from "@/types";

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
        ...(search && { search }),
        ...(statusFilter !== "ALL" && { status: statusFilter })
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      
      if (json.success) {
        setUsers(json.data.data);
        setTotalPages(json.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  const handleAction = async (userId: string, action: "approve" | "reject" | "revoke") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers(); // Refresh data
      } else {
        alert(json.error || `Failed to ${action} user`);
      }
    } catch (error) {
      alert(`An error occurred while trying to ${action} the user.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink mb-1">User Management</h1>
        <p className="text-sm text-ink-secondary">Review, approve, and manage Builder Passes.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-4 rounded-xl border border-divider shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-9 h-10 w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-3">
          <Filter className="w-4 h-4 text-ink-secondary" />
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val || "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-10">
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
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left relative">
            <thead className="bg-surface-raised text-xs text-ink-secondary uppercase font-semibold tracking-wider sticky top-0 z-10">
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
                    <Loader2 className="w-6 h-6 animate-spin text-accent-navy mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-secondary">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-canvas transition-fast">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-divider" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-raised border border-divider" />
                        )}
                        <div>
                          <p className="font-medium text-ink">{user.fullName}</p>
                          <p className="text-xs text-ink-secondary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-ink font-medium">{user.designation}</p>
                      <p className="text-xs text-ink-secondary">{user.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      {user.uniqueId ? (
                        <span className="font-mono text-xs bg-surface-raised px-2 py-1 rounded border border-divider">
                          {user.uniqueId}
                        </span>
                      ) : (
                        <span className="text-xs text-ink-secondary">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-surface-raised rounded-md text-ink-secondary">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {user.status === UserStatus.PENDING && (
                            <>
                              <DropdownMenuItem onClick={() => handleAction(user._id, "approve")}>
                                <CheckCircle className="mr-2 w-4 h-4 text-status-active" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction(user._id, "reject")}>
                                <XCircle className="mr-2 w-4 h-4 text-status-rejected" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}

                          {user.status === UserStatus.ACTIVE && (
                            <DropdownMenuItem onClick={() => handleAction(user._id, "revoke")}>
                              <ShieldBan className="mr-2 w-4 h-4 text-status-revoked" />
                              Revoke Pass
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            View Details / ID Card
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            <span className="text-sm text-ink-secondary">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ID Card / User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md bg-canvas">
          <DialogHeader>
            <DialogTitle className="font-heading">Builder Social Card</DialogTitle>
            <DialogDescription>
              View and export the official ID card for this user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            {selectedUser && (
              <IDCardExport 
                user={selectedUser} 
                verificationToken={selectedUser.verificationToken || "PENDING"} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
