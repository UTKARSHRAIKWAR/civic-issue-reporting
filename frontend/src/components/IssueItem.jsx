import React from "react";
// Use the recommended date-fns library for powerful and easy date formatting
import { formatDistanceToNow } from "date-fns";

const IssueItem = ({ issue }) => {
  // Map issue statuses to specific Tailwind CSS classes for dynamic styling
  const statusConfig = {
    Resolved: {
      color: "text-green-600 dark:text-green-500",
      icon: "check_circle",
    },
    In_Progress: {
      color: "text-orange-500 dark:text-orange-400",
      icon: "sync",
    },
    Open: {
      color: "text-red-500 dark:text-red-400",
      icon: "error",
    },
    Pending: {
      color: "text-blue-500 dark:text-blue-400",
      icon: "pending",
    },
  };

  // Get the style and icon for the current issue's status, with a safe fallback
  const currentStatus = statusConfig[issue.status] || {
    color: "text-slate-500 dark:text-slate-400",
    icon: "help",
  };

  // Safely parses the location string to extract only the name in parentheses
  const parseLocation = (locationString) => {
    if (!locationString || typeof locationString !== "string") {
      return "Location not available";
    }
    const match = locationString.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : locationString;
  };

  // Formats the date string into a relative time (e.g., "about 2 hours ago")
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Invalid date provided:", dateString);
      return "Invalid date";
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 py-2">
      <div className="flex w-full items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
        {/* Left side: All issue details */}
        <div className="flex flex-1 flex-col gap-1.5">
          {/* Title */}
          <h3
            className="truncate text-lg font-bold text-slate-900 dark:text-white"
            title={issue.title}
          >
            {issue.title || "No Title"}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-base">
              location_on
            </span>
            <span>{parseLocation(issue.location?.name)}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-base">
              calendar_today
            </span>
            <span className="capitalize">{formatDate(issue.createdAt)}</span>
          </div>

          {/* Status */}
          <div
            className={`mt-2 flex items-center gap-2 text-sm font-medium ${currentStatus.color}`}
          >
            <span className="material-symbols-outlined text-base">
              {currentStatus.icon}
            </span>
            <span>{issue.status || "Unknown"}</span>
          </div>
        </div>

        {/* Right side: Image preview */}
        <div className="h-28 w-40 flex-shrink-0">
          {issue.fileUrl ? (
            <div
              className="h-full w-full rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url("${issue.fileUrl}")` }}
              aria-label={`Image for ${issue.title}`}
            ></div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700">
              <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">
                image_not_supported
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueItem;
