import React from "react";
import { format } from "date-fns";

const IssueItem = ({ issue }) => {
  // Status configuration for color and icon
  const statusConfig = {
    Resolved: {
      color: "text-green-600 dark:text-green-500",
      icon: "check_circle",
    },
    In_Progress: {
      color: "text-orange-500 dark:text-orange-400",
      icon: "hourglass_top",
    },
    Open: { color: "text-red-500 dark:text-red-400", icon: "error" },
    Pending: { color: "text-blue-500 dark:text-blue-400", icon: "pending" },
  };

  const currentStatus = statusConfig[issue?.status] || {
    color: "text-slate-500 dark:text-slate-400",
    icon: "help",
  };

  // Parse location string to get content inside parentheses if available
  const parseLocation = (locationName) => {
    if (!locationName) return "Location not available";
    const match = locationName.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : locationName;
  };

  // Format the date in "MMM d, yyyy" format
  const formatDate = (dateString) => {
    if (!dateString) return "No date provided";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div
      className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
      aria-label={`Issue item: ${issue?.title || "No title"}`}
    >
      {/* Left side: Issue details */}
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {/* Category */}
        <p className="text-xs font-semibold text-orange-500">
          {issue?.category || "Uncategorized"}
        </p>

        {/* Title */}
        <h3
          className="truncate text-lg font-bold text-slate-800 dark:text-white"
          title={issue?.title || "No Title"}
        >
          {issue?.title || "No Title"}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span
            className="material-symbols-outlined text-sm"
            aria-hidden="true"
          >
            location_on
          </span>
          <span>{parseLocation(issue?.location?.name)}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span
            className="material-symbols-outlined text-sm"
            aria-hidden="true"
          >
            calendar_today
          </span>
          <span>{formatDate(issue?.createdAt)}</span>
        </div>

        {/* Status */}
        <div
          className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${currentStatus.color}`}
        >
          <span
            className="material-symbols-outlined text-sm"
            aria-hidden="true"
          >
            {currentStatus.icon}
          </span>
          <span>{issue?.status?.replace("_", " ") || "Unknown"}</span>
        </div>
      </div>

      {/* Right side: Image preview */}
      <div className="h-24 w-36 flex-shrink-0">
        {issue?.fileUrl ? (
          <div
            className="h-full w-full rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url("${issue.fileUrl}")` }}
            aria-label={`Image for ${issue?.title || "issue"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700">
            <span
              className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500"
              aria-label="No image available"
            >
              image_not_supported
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueItem;
