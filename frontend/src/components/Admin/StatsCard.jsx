function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col gap-2 shadow-sm">
      <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">
        {title}
      </p>
      <p className="text-slate-900 dark:text-white text-4xl font-bold leading-tight">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
