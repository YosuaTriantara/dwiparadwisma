const stats = [
  { value: "2003", label: "BERDIRI SEJAK" },
  { value: "200+", label: "ALUMNI" },
  { value: "50+", label: "PENGHARGAAN" },
  { value: "32", label: "ANGGOTA AKTIF" },
];

export default function Stats() {
  return (
    <section className="flex justify-center px-4 sm:px-8 lg:px-0 py-6 lg:py-8">
      <div className="w-full max-w-content border border-primary">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col gap-3.5 px-6 sm:px-10 lg:px-12 py-10 sm:py-12",
                "border-t border-t-primary",
                // Mobile 2-col: right border only on even indices (left column)
                i % 2 === 0 ? "border-r border-r-primary" : "",
                // Desktop 4-col: override — item at index 1 gets border-r, item at index 3 removes it
                i === 1 ? "lg:border-r lg:border-r-primary" : "",
                i === 3 ? "lg:border-r-0" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="text-accent-red text-3xl sm:text-4xl font-normal leading-tight">
                {stat.value}
              </span>
              <span className="text-ink/60 text-[10px] font-normal tracking-[0.1em] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
