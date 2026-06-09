"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarClock,
  FileSearch,
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
      <div>
        <h1 className="text-3xl font-bold">Reminders</h1>
        <p className="text-muted-foreground">
          Follow-ups generated from abnormal markers, recommendations, and report history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <CalendarClock className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">{reminders.length}</h2>
          <p className="text-sm text-muted-foreground">Active reminders</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">{highPriorityCount}</h2>
          <p className="text-sm text-muted-foreground">High priority</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <CalendarCheck className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">{mediumPriorityCount}</h2>
          <p className="text-sm text-muted-foreground">Medium priority</p>
        </div>
      </div>

      {reminders.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No reminders available"
          description="Upload and process reports to generate follow-up reminders."
        />
      ) : (
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
      )}

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">How reminders work</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These reminders are generated from abnormal metrics and preventive
          recommendations returned by your backend. They are not emergency alerts,
          prescriptions, or clinical instructions.
        </p>
      </div>
    </div>
  );
}
