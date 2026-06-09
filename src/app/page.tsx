import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  FileText,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  UploadCloud,
} from "lucide-react";

const features = [
  {
    title: "Medical Report Analysis",
    description:
      "Upload blood reports, prescriptions, scans, and checkup documents for structured health intelligence.",
    icon: FileText,
  },
  {
    title: "AI Health Explanation",
    description:
      "Understand extracted results in simple language with AI-generated summaries and preventive context.",
    icon: Brain,
  },
  {
    title: "Biomarker Trends",
    description:
      "Track health markers over time to detect repeated abnormalities and long-term changes.",
    icon: TrendingUp,
  },
  {
    title: "Preventive Health Score",
    description:
      "Get a preventive health score based on uploaded reports, abnormal values, and report history.",
    icon: HeartPulse,
  },
];

const steps = [
  {
    title: "Upload Reports",
    description: "Add medical documents like blood reports, scans, and prescriptions.",
    icon: UploadCloud,
  },
  {
    title: "AI Extracts Data",
    description: "HealthIQ extracts text, biomarkers, abnormal markers, and summaries.",
    icon: Brain,
  },
  {
    title: "Track Health Over Time",
    description: "View trends, risks, reminders, and preventive recommendations.",
    icon: Activity,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-none">HealthIQ</h1>
              <p className="text-xs text-muted-foreground">
                AI Health Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#security" className="hover:text-foreground">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="hidden rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border px-4 py-2 text-sm text-muted-foreground">
            Preventive healthcare dashboard powered by AI
          </div>

          <h2 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
            Understand your medical reports before problems become serious.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            HealthIQ analyzes medical reports, tracks biomarkers over time,
            explains abnormal values, and creates a preventive health dashboard
            for long-term monitoring.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Upload Report
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium hover:bg-muted"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="rounded-2xl border bg-muted/40 p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <h3 className="text-4xl font-bold">78</h3>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-background">
                <HeartPulse className="h-7 w-7" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm font-medium">RBC slightly below range</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Continue monitoring across future reports.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm font-medium">CBC mostly stable</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Most values appear within expected range.
                </p>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-sm font-medium">Trend data improving</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload more reports for stronger predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-4">
          <div>
            <h3 className="text-3xl font-bold">AI</h3>
            <p className="text-sm text-muted-foreground">Report analysis</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p className="text-sm text-muted-foreground">Health monitoring</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-sm text-muted-foreground">Biomarker support planned</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">Secure</h3>
            <p className="text-sm text-muted-foreground">Private health records</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">How HealthIQ works</h2>
          <p className="mt-3 text-muted-foreground">
            A simple workflow for converting medical documents into preventive
            health intelligence.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-muted p-3">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold">Core features</h2>
          <p className="mt-3 text-muted-foreground">
            Built for report analysis, health tracking, and preventive insights.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-muted p-3">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="security" className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="w-fit rounded-2xl bg-background p-5">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Health data needs serious privacy.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              HealthIQ should be designed with secure authentication, private access,
              controlled document storage, and clear medical disclaimers. The platform
              provides educational health intelligence, not diagnosis.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border bg-card p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold">Start building your health timeline.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Upload reports, track biomarkers, and convert scattered health records
            into a preventive intelligence dashboard.
          </p>

          <Link
            href="/dashboard/upload"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Upload First Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
