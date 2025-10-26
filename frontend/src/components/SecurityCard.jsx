import { toast } from "sonner";

const SecurityCard = () => {
  // You would add state and logic here for changing the password
  const handleChangePassword = () => {
    toast.info("Change password feature not yet implemented.");
  };

  return (
    <div className="flex flex-col rounded-xl border border-transparent bg-white p-6 shadow-sm @container dark:bg-background-dark dark:border-gray-700">
      <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Security
            </p>
            <p className="text-text-label text-base font-normal leading-normal">
              Manage your account password.
            </p>
          </div>
          <button
            onClick={handleChangePassword}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-gray-300 dark:border-gray-600 bg-transparent text-primary dark:text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/5 dark:hover:bg-primary/20"
          >
            <span className="truncate">Change Password</span>
          </button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 @lg:grid-cols-2">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-text-label text-sm font-medium leading-normal pb-2">
            Password
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal"
            readOnly={true}
            type="password"
            value="••••••••••"
          />
        </label>
      </div>
    </div>
  );
};

export default SecurityCard;
