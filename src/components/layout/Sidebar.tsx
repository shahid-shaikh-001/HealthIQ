"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Upload,
  User,
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-slate-950/85 px-4 py-5 backdrop-blur-2xl md:flex md:flex-col">
      <Link
        href="/dashboard"
        className="mb-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:bg-white/[0.07]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/20">
          <HeartPulse className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-xl font-bold leading-none text-white">HealthIQ</h1>
          <p className="mt-1 text-xs text-slate-500">
            Health Intelligence
          </p>
        </div>
      </Link>

      <div className="mb-4 px-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </p>
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
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-950/20"
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

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-300" />
          <p className="text-sm font-medium text-white">Secure session</p>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Your dashboard data is scoped to the authenticated user account.
        </p>
      </div>
    </aside>
  );
}
