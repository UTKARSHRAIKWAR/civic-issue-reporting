const ImpactCard = ({ issuesReported }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-xl border border-transparent bg-white p-6 shadow-sm dark:bg-background-dark dark:border-gray-700">
        <p className="text-text-label text-base font-medium leading-normal">
          Your Impact
        </p>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent/20">
            <span className="material-symbols-outlined text-accent text-3xl">
              flag
            </span>
          </div>
          <div>
            <p className="text-primary dark:text-white tracking-light text-3xl font-bold leading-tight">
              {issuesReported}
            </p>
            <p className="text-text-body dark:text-gray-300 text-base font-medium leading-normal">
              Total Issues Reported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactCard;
