import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experiences" },
  { label: "Social Links", href: "/admin/social-links" },
  { label: "Messages", href: "/admin/contacts" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 glass rounded-b-xl">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-display text-sm font-semibold text-foreground"
            >
              Admin
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-secondary"
            >
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4 pt-8">{children}</main>
    </div>
  );
}
