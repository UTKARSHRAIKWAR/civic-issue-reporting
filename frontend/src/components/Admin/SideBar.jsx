import React from "react";

// A reusable NavLink component for the sidebar
const NavLink = ({ href, icon, text, isActive = false }) => {
  const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg";
  // Active styles are now more specific
  const activeClasses =
    "bg-primary/10 dark:bg-primary/20 text-primary dark:text-white";
  // Inactive styles for other links
  const inactiveClasses =
    "text-[#111318] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <a
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <p className="text-sm font-medium">{text}</p>
    </a>
  );
};

const SideBar = () => {
  return (
    // Sidebar container
    <aside className="w-64 bg-white dark:bg-background-dark flex-shrink-0 border-r border-gray-200 dark:border-gray-800 hidden md:flex">
      <div className="p-4 flex flex-col w-full">
        {/* Header */}
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
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavLink href="/dashboard" icon="dashboard" text="Dashboard" />
          <NavLink href="/admin-dashboard" icon="list" text="Issues" />
          <NavLink href="/users" icon="group" text="Users" />
          <NavLink href="/analytics" icon="settings" text="Analytics" />
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
