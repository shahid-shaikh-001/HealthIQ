import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import LandingHero3D from "../components/landing/LandingHero3D";
import LandingSectionCard from "../components/landing/LandingSectionCard";
import BiomarkerMarquee from "../components/landing/BiomarkerMarquee";

 const features = [
  {
    title: "Medical report intelligence",
    description:
      "Convert blood reports, prescriptions, scans, and checkup documents into structured health records with extracted text and metrics.",
    iconName: "fileText",
  },
  {
    title: "Plain-language summaries",
    description:
      "Get simple explanations of uploaded reports, abnormal markers, and preventive context without replacing medical judgment.",
    iconName: "brain",
  },
  {
    title: "Biomarker trend tracking",
    description:
      "Track repeated values over time so you can identify direction, consistency, and recurring abnormal patterns.",
    iconName: "trendingUp",
  },
  {
    title: "Preventive health score",
    description:
      "Generate a practical score using uploaded reports, extracted biomarkers, abnormal metrics, and recommendation signals.",
    iconName: "heartPulse",
  },
] as const

const steps = [
  {
    title: "Upload medical records",
    description:
      "Add PDFs or images of health reports. Each document stays connected to the authenticated user profile.",
    iconName: "uploadCloud",
  },
  {
    title: "Extract structured values",
    description:
      "HealthIQ processes the document, extracts readable text, identifies biomarkers, and classifies marker status.",
    iconName: "activity",
  },
  {
    title: "Monitor preventive signals",
    description:
      "Review health score, abnormal markers, trend charts, reminders, and recommendations from one dashboard.",
    iconName: "shieldCheck",
  },
] as const

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/20">
              <HeartPulse className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-none">HealthIQ</h1>
              <p className="text-xs text-slate-400">
                Preventive health intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-slate-300 md:flex">
            <a href="#workflow" className="healthiq-nav-link px-3 hover:text-white">
              Workflow
            </a>
            <a href="#features" className="healthiq-nav-link px-3 hover:text-white">
              Features
            </a>
            <a href="#security" className="healthiq-nav-link px-3 hover:text-white">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/sign-in"
              className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="healthiq-primary-button rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      <LandingHero3D />

      <BiomarkerMarquee />

      <section id="workflow" className="relative overflow-hidden bg-slate-950 px-6 py-28">
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              From document upload to preventive dashboard
            </div>

            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              A cleaner way to understand medical records.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              HealthIQ organizes scattered reports into a structured timeline
              that is easier to review, monitor, and discuss with professionals.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <LandingSectionCard
                key={step.title}
                title={step.title}
                description={step.description}
                iconName={step.iconName}
                eyebrow={`Step ${index + 1}`}
                delay={index * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative bg-[#07111f] px-6 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.08),transparent_28rem),radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.08),transparent_28rem)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Core System
              </p>

              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Built for long-term preventive health tracking.
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-7 text-slate-400 lg:ml-auto">
              The platform focuses on the repeated health data that usually gets
              buried in old PDFs, screenshots, and clinic files.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature, index) => (
              <LandingSectionCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                iconName={feature.iconName}
                delay={index * 0.06}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="relative overflow-hidden bg-slate-950 px-6 py-28">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-300/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <LockKeyhole className="h-7 w-7" />
            </div>

            <h2 className="text-4xl font-semibold tracking-tight">
              Designed around private health records.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Health data should never feel casual. HealthIQ uses authenticated
              access, user-specific database filtering, controlled file storage,
              and medical disclaimers throughout the app.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-3 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <h3 className="font-semibold">User-specific access</h3>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Dashboard, documents, metrics, health score, and profile data are
                filtered by authenticated user identity.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-3 flex items-center gap-3">
                <FileText className="h-5 w-5 text-cyan-300" />
                <h3 className="font-semibold">Controlled document workflow</h3>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Uploaded reports move through clear states: pending, processing,
                completed, or failed, with retry support for temporary AI failures.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-3 flex items-center gap-3">
                <Brain className="h-5 w-5 text-cyan-300" />
                <h3 className="font-semibold">Educational AI output</h3>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                HealthIQ explains data for awareness and prevention. It does not
                replace diagnosis, treatment, or clinical judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07111f] px-6 py-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-blue-500/5 to-emerald-400/10 p-10 text-center backdrop-blur-xl md:p-14">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
            <HeartPulse className="h-7 w-7" />
          </div>

          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Start building your health timeline.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Upload reports, review extracted biomarkers, and turn medical records
            into a preventive health dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              Upload First Report
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
