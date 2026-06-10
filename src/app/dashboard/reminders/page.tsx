"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarClock,
  FileSearch,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import ReminderItem from "../../../components/reminders/ReminderItem";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingState from "../../../components/shared/LoadingState";
import { DashboardData, getDashboardData } from "../../../lib/dashboard-api";

type Reminder = {
  title: string;
  description: string;
  date: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  icon: typeof AlertTriangle;
};

function normalizePriority(priority: string): "LOW" | "MEDIUM" | "HIGH" {
  if (priority === "HIGH" || priority === "CRITICAL") return "HIGH";
  if (priority === "MEDIUM") return "MEDIUM";
  return "LOW";
}

function createReminders(dashboard: DashboardData): Reminder[] {
  const abnormalMetricReminders: Reminder[] = dashboard.abnormalMetrics.map(
    (metric) => ({
      title: `Recheck ${metric.name}`,
      description: `${metric.name} is marked as ${metric.status}. Current value is ${metric.value} ${metric.unit}. Reference range: ${
        metric.normalMin ?? "N/A"
      } - ${metric.normalMax ?? "N/A"} ${metric.unit}.`,
      date: metric.status === "CRITICAL" ? "Immediately" : "In 2 weeks",
      priority: normalizePriority(metric.status),
      icon: AlertTriangle,
    })
  );

  const recommendationReminders: Reminder[] = dashboard.recommendations.map(
    (recommendation) => ({
      title: `Review ${recommendation.metric}`,
      description: recommendation.message,
      date: recommendation.priority === "HIGH" ? "This week" : "Next checkup",
      priority: normalizePriority(recommendation.priority),
      icon: Stethoscope,
    })
  );

  const uploadReminder: Reminder = {
    title: "Upload next medical report",
    description:
      "Add your next blood report or checkup document to improve trend tracking, health score accuracy, and preventive recommendations.",
    date: "Next month",
    priority: "LOW",
    icon: FileSearch,
  };

  return [
    ...abnormalMetricReminders,
    ...recommendationReminders,
    uploadReminder,
  ];
}

export default function RemindersPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReminders() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load reminders"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReminders();
  }, []);

  const reminders = useMemo(() => {
    if (!dashboard) return [];
    return createReminders(dashboard);
  }, [dashboard]);

  const highPriorityCount = reminders.filter(
    (reminder) => reminder.priority === "HIGH"
  ).length;

  const mediumPriorityCount = reminders.filter(
    (reminder) => reminder.priority === "MEDIUM"
  ).length;

  const lowPriorityCount = reminders.filter(
    (reminder) => reminder.priority === "LOW"
  ).length;

  if (isLoading) {
    return (
      <LoadingState
        title="Loading reminders"
        description="Generating follow-up reminders from abnormal metrics and recommendations."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load reminders"
        description={error || "Reminder data is unavailable."}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <CalendarClock className="h-4 w-4 text-cyan-300" />
            Preventive follow-up system
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Reminders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Follow-ups generated from abnormal markers, recommendations, and
            report history. Use them as awareness prompts, not clinical
            instructions.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-300">
          <CalendarCheck className="h-4 w-4" />
          {reminders.length} active reminders
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <CalendarClock className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {reminders.length}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Active reminders</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-300/10 text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {highPriorityCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">High priority</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300">
            <CalendarCheck className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {mediumPriorityCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Medium priority</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {lowPriorityCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Low priority</p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <EmptyState
            icon={CalendarClock}
            title="No reminders available"
            description="Upload and process reports to generate follow-up reminders."
          />
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Follow-up Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Generated from abnormal markers, recommendations, and upload
                history.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
              {reminders.length} reminders
            </span>
          </div>

          <div className="space-y-4">
            {reminders.map((reminder, index) => (
              <ReminderItem
                key={`${reminder.title}-${index}`}
                title={reminder.title}
                description={reminder.description}
                date={reminder.date}
                priority={reminder.priority}
                icon={reminder.icon}
              />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <CalendarCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">How reminders work</h2>
            <p className="text-sm text-slate-500">
              Reminder source and safety note
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          These reminders are generated from abnormal metrics and preventive
          recommendations returned by your backend. They are not emergency
          alerts, prescriptions, or clinical instructions.
        </p>
      </section>
    </div>
  );
}
