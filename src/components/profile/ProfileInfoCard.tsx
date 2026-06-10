import { LucideIcon } from "lucide-react";

type ProfileInfoCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function ProfileInfoCard({
  title,
  value,
  description,
  icon: Icon,
}: ProfileInfoCardProps) {
  return (
    <div className="group rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.075]">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-slate-500">{title}</p>

      <h2 className="mt-2 line-clamp-2 text-xl font-semibold text-white">
        {value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
