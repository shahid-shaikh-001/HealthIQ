"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Upload,
  User,
  X,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload Report", href: "/dashboard/upload", icon: Upload },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Insights", href: "/dashboard/insights", icon: Activity },
  { label: "Health Score", href: "/dashboard/health-score", icon: HeartPulse },
  { label: "Trends", href: "/dashboard/trends", icon: BarChart3 },
  { label: "Reminders", href: "/dashboard/reminders", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          <aside className="relative z-10 h-full w-80 max-w-[85vw] border-r bg-background p-5 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-xl font-bold leading-none">HealthIQ</h1>
                  <p className="text-xs text-muted-foreground">
                    AI Health Intelligence
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
