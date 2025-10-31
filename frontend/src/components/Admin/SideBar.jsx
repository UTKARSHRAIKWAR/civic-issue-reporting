import React, { useState } from "react";

// ✅ Reusable NavLink
const NavLink = ({ href, icon, text, isActive = false }) => {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
  const activeClasses =
    "bg-primary/10 dark:bg-primary/20 text-primary dark:text-white";
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

// ✅ Sidebar Component
const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🔹 Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2.5 rounded-lg shadow-md focus:outline-none transition-transform duration-200 ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        <span className="material-symbols-outlined text-[26px] leading-none">
          {isOpen ? "close" : "menu"}
        </span>
      </button>

      {/* 🔹 Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white dark:bg-background-dark border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 flex flex-col w-full h-full">
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
          <nav className="flex flex-col gap-2 flex-1">
            <NavLink href="/dashboard" icon="dashboard" text="Dashboard" />
            <NavLink href="/admin-dashboard" icon="list" text="Issues" />
            <NavLink href="/users" icon="group" text="Users" />
            <NavLink href="/analytics" icon="settings" text="Analytics" />
          </nav>
        </div>
      </aside>

      {/* 🔹 Overlay for Mobile (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
