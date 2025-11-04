import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const IssueItem = ({ issue }) => {
  const navigate = useNavigate();

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

  const parseLocation = (locationName) => {
    if (!locationName) return "Location not available";
    const match = locationName.match(/\(([^)]+)\)/);
    return match ? match[1].trim() : locationName;
  };

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
      className="group relative flex flex-col sm:flex-row w-full items-start sm:items-center gap-3 sm:gap-4 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
      aria-label={`Issue item: ${issue?.title || "No title"}`}
    >
      {/* Image Section (top on mobile) */}
      <div className="w-full sm:w-36 h-40 sm:h-24 flex-shrink-0 overflow-hidden rounded-md">
        {issue?.fileUrl ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${issue.fileUrl}")` }}
            aria-label={`Image for ${issue?.title || "issue"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
            <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">
              image_not_supported
            </span>
          </div>
        )}
      </div>

      {/* Issue Details */}
      <div className="flex flex-1 flex-col justify-center gap-1.5 w-full">
        <p className="text-xs font-semibold text-orange-500">
          {issue?.category || "Uncategorized"}
        </p>

        <h3
          className="truncate text-base sm:text-lg font-bold text-slate-800 dark:text-white"
          title={issue?.title || "No Title"}
        >
          {issue?.title || "No Title"}
        </h3>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span>{parseLocation(issue?.location?.name)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-sm">
            calendar_today
          </span>
          <span>{formatDate(issue?.createdAt)}</span>
        </div>

        <div
          className={`mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-medium ${currentStatus.color}`}
        >
          <span className="material-symbols-outlined text-sm">
            {currentStatus.icon}
          </span>
          <span>{issue?.status?.replace("_", " ") || "Unknown"}</span>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => navigate(`/details/${issue._id}`)}
          className="mt-3 sm:mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 sm:absolute sm:bottom-3 sm:right-3 sm:opacity-0 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:scale-100 hover:bg-blue-700 w-full sm:w-auto"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default IssueItem;
