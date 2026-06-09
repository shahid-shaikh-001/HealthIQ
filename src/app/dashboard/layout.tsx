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
    <main className="min-h-screen bg-muted/20">
      <div className="flex">
        <Sidebar />

        <section className="min-h-screen flex-1">
          <DashboardHeader />

          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
