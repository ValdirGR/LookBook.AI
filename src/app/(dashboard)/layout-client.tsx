"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  Image,
  Sparkles,
  CreditCard,
  Settings,
  Users,
  Palette,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Coleções", href: "/collections", icon: FolderOpen },
  { label: "Galeria", href: "/gallery", icon: Image },
  { label: "Gerar", href: "/generate", icon: Sparkles },
  { label: "Modelos", href: "/models", icon: Users },
  { label: "Presets", href: "/presets", icon: Palette },
];

const bottomLinks = [
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
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
      <div className={cn("dashboard-main", collapsed && "dashboard-main-collapsed")}>
        <Topbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
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
      "sidebar",
      collapsed && "sidebar-collapsed",
      mobileOpen && "sidebar-mobile-open"
    )}>
      <div className="sidebar-header">
        <Logo size={collapsed ? "sm" : "md"} variant={collapsed ? "mark" : "full"} />
      </div>

      <nav className="sidebar-nav" aria-label="Menu do dashboard">
        <div className="sidebar-links">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn("sidebar-link", isActive && "sidebar-link-active")}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={20} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          {bottomLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn("sidebar-link", isActive && "sidebar-link-active")}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={20} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

function Topbar({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            className="mobile-menu-btn"
            onClick={onMobileMenuToggle}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="topbar-right">
          <ThemeToggle />
          <div className="topbar-avatar">
            <div className="avatar-placeholder">U</div>
          </div>
        </div>
      </div>
    </header>
  );
}
