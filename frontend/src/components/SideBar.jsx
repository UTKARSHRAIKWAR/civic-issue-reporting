const SideBar = () => {
  return (
    <div>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-background-dark flex-shrink-0 border-r border-gray-200 dark:border-gray-800">
        <div className="p-4">
          <div className="flex gap-3 items-center mb-6">
            <div className="bg-primary rounded-full size-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                campaign
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-medium text-[#111318] dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm font-normal text-[#637088] dark:text-gray-400">
                Civic Issue Tracker
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <a
              href="/admin-dashboard"
              className="flex items-center gap-3 px-3 py-2 text-[#111318] dark:text-gray-300"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </a>
            <a
              href="/admin-dashboard/issues"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-white"
            >
              <span className="material-symbols-outlined">list</span>
              <p className="text-sm font-medium">Issues</p>
            </a>
            <a
              href="/users"
              className="flex items-center gap-3 px-3 py-2 text-[#111318] dark:text-gray-300"
            >
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium">Users</p>
            </a>
            <a
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 text-[#111318] dark:text-gray-300"
            >
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </a>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
