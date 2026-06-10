"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  FileText,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
} from "lucide-react";

type IconName =
  | "activity"
  | "brain"
  | "fileText"
  | "heartPulse"
  | "lockKeyhole"
  | "shieldCheck"
  | "sparkles"
  | "trendingUp"
  | "uploadCloud";

const iconMap = {
  activity: Activity,
  brain: Brain,
  fileText: FileText,
  heartPulse: HeartPulse,
  lockKeyhole: LockKeyhole,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  trendingUp: TrendingUp,
  uploadCloud: UploadCloud,
};

type LandingSectionCardProps = {
  title: string;
  description: string;
  iconName: IconName;
  eyebrow?: string;
  delay?: number;
};

export default function LandingSectionCard({
  title,
  description,
  iconName,
  eyebrow,
  delay = 0,
}: LandingSectionCardProps) {
  const Icon = iconMap[iconName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
        <Icon className="h-6 w-6" />
      </div>

      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">
          {eyebrow}
        </p>
      )}

      <h3 className="text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </motion.div>
  );
}
