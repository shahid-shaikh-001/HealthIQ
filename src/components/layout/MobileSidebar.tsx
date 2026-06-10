"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <aside className="relative z-10 h-full w-80 max-w-[85vw] border-r border-white/10 bg-slate-950 p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-slate-950">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-xl font-bold leading-none text-white">
                    HealthIQ
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    Health Intelligence
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                        isActive
                          ? "bg-cyan-300 text-slate-950"
                          : "bg-white/[0.04] text-slate-400 group-hover:bg-white/[0.08] group-hover:text-cyan-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

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
