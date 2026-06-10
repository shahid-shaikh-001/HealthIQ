type DocumentDetailCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function DocumentDetailCard({
  title,
  description,
  children,
}: DocumentDetailCardProps) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
