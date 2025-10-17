import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";

const Header = ({ onNotificationsClick, onProfileClick }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce logic (wait 300ms before updating global search)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localQuery, setSearchQuery]);

  const handleSearchChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleNotifications =
    onNotificationsClick || (() => alert("Notifications Clicked!"));
  const handleProfile = onProfileClick || (() => alert("Profile Clicked!"));

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-slate-800">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <div className="size-6 text-blue-600">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
          </svg>
        </div>
        <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white sm:text-lg">
          Civic Connect
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 justify-end px-6">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search for issues, locations..."
            className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-gray-200 dark:placeholder:text-gray-400"
            value={localQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleNotifications}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700"
          aria-label="View notifications"
        >
          <span className="material-symbols-outlined text-[20px] text-gray-700 dark:text-gray-300">
            notifications
          </span>
        </button>
        <div
          onClick={handleProfile}
          className="h-10 w-10 cursor-pointer rounded-full border border-gray-300 bg-cover bg-center dark:border-gray-700"
          style={{
            backgroundImage:
              'url("https://api.dicebear.com/7.x/adventurer/svg?seed=CivicUser")',
          }}
          aria-label="Open user menu"
          role="button"
        ></div>
      </div>
    </header>
  );
};

export default Header;
