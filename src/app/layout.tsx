import type { Metadata } from "next";
import AuthProvider from "../components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HealthIQ — AI Health Intelligence",
    template: "%s | HealthIQ",
  },
  description:
    "AI-powered preventive health intelligence platform for analyzing medical reports, tracking biomarkers, and generating health insights.",
  keywords: [
    "HealthIQ",
    "AI health dashboard",
    "medical report analysis",
    "biomarker tracking",
    "preventive healthcare",
    "health intelligence",
  ],
  authors: [
    {
      name: "HealthIQ",
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "HealthIQ — AI Health Intelligence",
    description:
      "Upload medical reports, extract biomarkers, track trends, and understand health records with AI.",
    type: "website",
    siteName: "HealthIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthIQ — AI Health Intelligence",
    description:
      "AI-powered preventive healthcare dashboard for medical reports and biomarker tracking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"className="dark" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
