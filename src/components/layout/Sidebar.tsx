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
    <aside className="hidden h-screen w-64 flex-col border-r bg-background px-4 py-6 md:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-xl font-bold leading-none">HealthIQ</h1>
          <p className="text-xs text-muted-foreground">AI Health Intelligence</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
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
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
