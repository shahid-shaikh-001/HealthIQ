"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
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
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage account details, health profile, and security preferences.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User profile"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <UserCircle className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.name || "HealthIQ User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Preventive health intelligence profile
              </p>
            </div>
          </div>

          <button className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted">
            Edit Profile
          </button>
        </div>
      </div>

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
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Health Profile Summary</h2>
              <p className="text-sm text-muted-foreground">
                Current profile generated from uploaded documents and metrics.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Health Score</span>
              <span className="font-medium">{healthScore}/100</span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="font-medium">{riskLevel}</span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Abnormal Metrics</span>
              <span className="font-medium">
                {dashboard.stats.abnormalMetricCount}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Last Score Update</span>
              <span className="font-medium">{formatDate(calculatedAt)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Account Security</h2>
              <p className="text-sm text-muted-foreground">
                Health data needs strict privacy and controlled access.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Authentication</span>
              <span className="font-medium">Google account</span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Data Access</span>
              <span className="font-medium">Private user data</span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Recommendations</span>
              <span className="font-medium">
                {dashboard.stats.recommendationCount}
              </span>
            </div>

            <div className="flex justify-between rounded-xl border p-3 text-sm">
              <span className="text-muted-foreground">Medical Disclaimer</span>
              <span className="font-medium">Required</span>
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <h2 className="font-semibold">Account note</h2>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          This profile currently uses backend dashboard data. Later, we can add
          editable health profile fields such as age, gender, height, weight,
          blood group, allergies, chronic conditions, and emergency contact.
        </p>
      </div>
    </div>
  );
}
