"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import {
  LayoutDashboard,
  User,
  Code,
  Briefcase,
  Share2,
  MessageSquare,
  FolderKanban,
  Menu,
  X,
  Bell,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Menu",
    items: [
      { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Profile", href: "/admin/profile", icon: <User className="h-4 w-4" /> },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Projects", href: "/admin/projects", icon: <FolderKanban className="h-4 w-4" /> },
      { label: "Skills", href: "/admin/skills", icon: <Code className="h-4 w-4" /> },
      { label: "Experience", href: "/admin/experiences", icon: <Briefcase className="h-4 w-4" /> },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Social Links", href: "/admin/social-links", icon: <Share2 className="h-4 w-4" /> },
      { label: "Messages", href: "/admin/contacts", icon: <MessageSquare className="h-4 w-4" /> },
    ],
  },
  {
    title: "Links",
    items: [
      { label: "View Site", href: "/", icon: <ExternalLink className="h-4 w-4" /> },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-card transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-4">
          <Link href="/admin" className="font-display text-lg font-bold tracking-wider text-foreground">
            PORTFOLIO
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="mb-1 px-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">
                {section.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                      isActive(item.href)
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                    }`}
                  >
                    <span className={isActive(item.href) ? "text-accent" : "text-muted-foreground/60"}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border/50 bg-background/95 px-4 backdrop-blur md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          {/* Notification bell */}
          <Link
            href="/admin/contacts"
            className="relative text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </Link>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card font-display text-xs font-bold text-accent transition-colors hover:border-accent/50"
            >
              A
            </button>
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded border border-border bg-card py-1 shadow-lg">
                  <div className="border-b border-border/50 px-3 py-2">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Admin</p>
                  </div>
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Site
                  </Link>
                  <div className="border-t border-border/50 px-3 py-1">
                    <LogoutButton />
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
