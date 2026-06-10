import type { Metadata } from "next";
import Sidebar from "../../components/layout/Sidebar";
import DashboardHeader from "../../components/layout/DashboardHeader";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "HealthIQ dashboard for medical documents, health score, biomarker trends, reminders, and AI insights.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050b14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_30rem),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.10),transparent_34rem),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_30rem)]" />
      <div className="pointer-events-none fixed inset-0 healthiq-grid-bg opacity-[0.12]" />

      <Sidebar />

      <section className="relative min-h-screen md:pl-72">
        <DashboardHeader />

        <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}