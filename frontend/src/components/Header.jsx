import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-6 py-3">
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
        <h1 className="text-gray-900 dark:text-white text-base sm:text-lg font-semibold tracking-tight">
          Civic Connect
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 justify-end px-6">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search for issues, locations..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[20px]">
            notifications
          </span>
        </button>
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-300 dark:border-gray-700"
          style={{
            backgroundImage:
              'url("https://api.dicebear.com/7.x/adventurer/svg?seed=CivicUser")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
