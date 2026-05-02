const StatCard = ({ icon: Icon, label, value, tone = "sky" }) => {
  const tones = {
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
  };

  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${tones[tone] || tones.sky}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
