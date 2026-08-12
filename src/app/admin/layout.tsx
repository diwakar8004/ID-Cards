"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, Settings, LogOut, ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-warm-cream">
        <Sidebar className="border-r border-divider bg-deep-green">
          <SidebarHeader className="p-4 border-b border-divider">
            <Link href="/admin" className="flex items-center gap-2.5 px-2">
              <Shield className="w-5 h-5 text-accent-gold" />
              <span className="font-heading font-bold text-warm-cream text-sm uppercase">
                HACKER गोवा HOUSE
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-warm-cream/50 text-xs font-semibold px-4 pt-4 pb-2 uppercase tracking-wider">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.url} className="block w-full">
                        <SidebarMenuButton 
                          isActive={pathname === item.url}
                          className={`text-sm ${pathname === item.url ? 'text-warm-cream font-semibold bg-deep-green-dark' : 'text-warm-cream/70 hover:text-warm-cream hover:bg-deep-green-dark'}`}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-divider">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-accent-red hover:text-accent-red hover:bg-status-revoked-bg"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
          <header className="h-16 border-b border-divider bg-warm-cream flex items-center px-6 sticky top-0 z-30 shrink-0">
            <SidebarTrigger className="mr-4 lg:hidden" />
            <div className="flex items-center text-sm text-text-deep">
              <span className="font-medium text-text-deep">Admin</span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="capitalize text-muted-green">{pathname === "/admin" ? "Dashboard" : pathname.split('/').pop()}</span>
            </div>
          </header>
          <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
