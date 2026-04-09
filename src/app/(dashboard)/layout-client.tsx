"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LayoutDashboard,
  Sparkles,
  CreditCard,
  Settings,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Coleções", href: "/collections", icon: FolderOpen },
  { label: "Nova Geração", href: "/generate", icon: Sparkles },
  { label: "Histórico", href: "/gallery", icon: Clock },
];

const bottomLinks = [
  { label: "Planos", href: "/billing", icon: CreditCard },
  { label: "Configurações", href: "/settings", icon: Settings },
];

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout bg-[#0A0A0A] text-white min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed(!collapsed)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn("dashboard-main w-full", collapsed && "dashboard-main-collapsed")}>
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#1C1B1A] bg-[#0A0A0A]">
          <Logo size="sm" />
          <button onClick={() => setMobileOpen(true)} className="text-white p-2">
            <Menu size={24} />
          </button>
        </div>
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "sidebar border-r border-[#1C1B1A] bg-[#0A0A0A] flex flex-col justify-between fixed top-0 bottom-0 z-40 transition-all duration-300",
      collapsed ? "w-[72px]" : "w-[260px]",
      mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#1C1B1A]/50 shrink-0">
          <Logo size={collapsed ? "sm" : "md"} variant={collapsed ? "mark" : "full"} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1" aria-label="Menu do dashboard">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) || (link.href === "/dashboard" && pathname === "/collections"); // temporary active state adjustment
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-[#1E1D1B] text-[#D4BA85]" 
                    : "text-[#9B9590] hover:bg-[#1E1D1B]/50 hover:text-white"
                )}
                title={collapsed ? link.label : undefined}
                onClick={() => mobileOpen && onMobileClose()}
              >
                <link.icon size={18} className={cn("shrink-0", isActive ? "text-[#D4BA85]" : "text-[#9B9590] group-hover:text-white")} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}

          <div className="mt-8 mb-2 px-3">
            <div className="h-[1px] w-full bg-[#1C1B1A]" />
          </div>

          {bottomLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-[#1E1D1B] text-[#D4BA85]" 
                    : "text-[#9B9590] hover:bg-[#1E1D1B]/50 hover:text-white"
                )}
                title={collapsed ? link.label : undefined}
                onClick={() => mobileOpen && onMobileClose()}
              >
                <link.icon size={18} className={cn("shrink-0", isActive ? "text-[#D4BA85]" : "text-[#9B9590] group-hover:text-white")} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Credits Card */}
        <div className="p-4 shrink-0">
          {!collapsed ? (
            <div className="bg-[#151413] border border-[#1C1B1A] rounded-xl p-4">
              <div className="flex items-center gap-2 text-white font-medium text-sm mb-3">
                <Zap size={16} className="text-[#D4BA85]" />
                Créditos
              </div>
              <div className="w-full bg-[#2A2928] h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-[#D4BA85] h-full w-[63%]" />
              </div>
              <div className="text-xs text-[#9B9590]">
                127 / 200 restantes
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-[#151413] border border-[#1C1B1A] flex items-center justify-center text-[#D4BA85]">
                <Zap size={14} />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1A1918] border border-[#2E2D2A] text-[#9B9590] flex items-center justify-center hover:text-white hover:border-[#4A4844] transition-colors md:flex hidden z-50"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
