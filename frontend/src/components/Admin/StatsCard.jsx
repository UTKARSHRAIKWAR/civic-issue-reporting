function StatsCard({ title, value }) {
  return (
    <div
      className="
        bg-white dark:bg-slate-900/70 
        border border-slate-200 dark:border-slate-800 
        rounded-2xl p-5 sm:p-6 
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        gap-3 shadow-sm hover:shadow-md 
        transition-all duration-200 ease-in-out
      "
    >
      <p
        className="
          text-slate-500 dark:text-slate-400 
          text-sm sm:text-base font-medium
          leading-normal text-center sm:text-left
        "
      >
        {title}
      </p>

      <p
        className="
          text-slate-900 dark:text-white 
          text-3xl sm:text-4xl font-bold 
          leading-tight text-center sm:text-right
          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}

export default StatsCard;
