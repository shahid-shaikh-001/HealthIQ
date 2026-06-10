"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserCircle,
} from "lucide-react";

import ProfileInfoCard from "../../../components/profile/ProfileInfoCard";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";
import { DashboardData, getDashboardData } from "../../../lib/dashboard-api";

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRiskClass(riskLevel: string) {
  if (riskLevel === "LOW") {
    return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
  }

  if (riskLevel === "MEDIUM") {
    return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
  }

  if (riskLevel === "HIGH") {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  return "border-slate-300/20 bg-white/10 text-slate-300";
}

export default function ProfilePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading profile"
        description="Fetching your account and health intelligence profile."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load profile"
        description={error || "Profile data is unavailable."}
      />
    );
  }

  const user = dashboard.user;
  const healthScore = dashboard.latestHealthScore?.score ?? 0;
  const riskLevel = dashboard.latestHealthScore?.riskLevel ?? "UNKNOWN";
  const calculatedAt = dashboard.latestHealthScore?.calculatedAt;
  const riskClass = getRiskClass(riskLevel);

  const profileStats = [
    {
      title: "Email",
      value: user.email,
      description: "Primary account email connected with HealthIQ.",
      icon: Mail,
    },
    {
      title: "Documents",
      value: `${dashboard.stats.documentCount} Uploaded`,
      description: "Medical records uploaded for AI health analysis.",
      icon: FileText,
    },
    {
      title: "Health Score",
      value: `${healthScore}/100`,
      description: `Latest calculated risk level: ${riskLevel}.`,
      icon: HeartPulse,
    },
    {
      title: "Metrics",
      value: `${dashboard.stats.metricCount} Extracted`,
      description: "Structured biomarkers extracted from processed reports.",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <User className="h-4 w-4 text-cyan-300" />
            Account and health profile
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            View your account identity, dashboard activity, health score status,
            and HealthIQ security context.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${riskClass}`}
        >
          <HeartPulse className="h-4 w-4" />
          {riskLevel} Risk
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User profile"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <UserCircle className="h-12 w-12 text-slate-500" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                {user.name || "HealthIQ User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preventive health intelligence profile
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Authenticated account
              </div>
            </div>
          </div>

          <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-400">
  <LockKeyhole className="h-4 w-4 text-cyan-300" />
  Profile synced from Google
</div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {profileStats.map((item) => (
          <ProfileInfoCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Health Profile Summary
              </h2>

              <p className="text-sm text-slate-500">
                Current profile generated from uploaded documents and metrics.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Health Score</span>
              <span className="font-medium text-white">{healthScore}/100</span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Risk Level</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${riskClass}`}>
                {riskLevel}
              </span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Abnormal Metrics</span>
              <span className="font-medium text-white">
                {dashboard.stats.abnormalMetricCount}
              </span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Last Score Update</span>
              <span className="font-medium text-white">
                {formatDate(calculatedAt)}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Account Security
              </h2>

              <p className="text-sm text-slate-500">
                Health data needs strict privacy and controlled access.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Authentication</span>
              <span className="font-medium text-white">Google account</span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Data Access</span>
              <span className="font-medium text-white">Private user data</span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Recommendations</span>
              <span className="font-medium text-white">
                {dashboard.stats.recommendationCount}
              </span>
            </div>

            <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm">
              <span className="text-slate-500">Medical Disclaimer</span>
              <span className="font-medium text-white">Required</span>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">Account note</h2>
            <p className="text-sm text-slate-500">
              Future editable profile fields
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          This profile currently uses backend dashboard data. Later, we can add
          editable health profile fields such as age, gender, height, weight,
          blood group, allergies, chronic conditions, and emergency contact.
        </p>
      </section>
    </div>
  );
}
