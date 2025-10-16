const Skeleton = () => (
  <div className="w-full max-w-4xl px-4 py-2">
    <div className="flex animate-pulse items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="mt-2 h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="h-28 w-40 flex-shrink-0 rounded-md bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);
export default Skeleton;
