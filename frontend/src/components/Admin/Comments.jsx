import React from "react";

export const Timeline = () => {
  return (
    <div>
      {" "}
      <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
          Timeline
        </h2>
        <div className="space-y-6 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
          <div className="relative pl-8">
            <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-white dark:ring-background-dark/50"></div>
            <p className="font-medium text-sm text-[#111318] dark:text-white">
              Issue Submitted
            </p>
            <p className="text-xs text-[#637088] dark:text-gray-400">
              April 23, 2024 - 10:00 AM
            </p>
          </div>
          <div className="relative pl-8">
            <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-background-dark/50"></div>
            <p className="font-medium text-sm text-[#111318] dark:text-white">
              Assigned to Water Dept.
            </p>
            <p className="text-xs text-[#637088] dark:text-gray-400">
              April 23, 2024 - 11:30 AM
            </p>
          </div>
          <div className="relative pl-8">
            <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-background-dark/50"></div>
            <p className="font-medium text-sm text-[#111318] dark:text-white">
              Marked as "In Progress"
            </p>
            <p className="text-xs text-[#637088] dark:text-gray-400">
              April 24, 2024 - 9:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
const Comments = () => {
  return (
    <div>
      <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
          Comments
        </h2>
        <div className="space-y-4">
          {/* Comment 1 */}
          <div className="flex gap-3">
            <img
              className="size-8 rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwJyIF32jxGicOSEtqB2YcJIgKXYcohIHpOwY8XUNmz7bp84V7WRaXkKf5iUFDCd1DjSrfefyt30mHrF52onLurV830eRohFhM1RdMzgVY_Ff0q4RYzxy4ADDZ2Pe4mC0pKbLnx0YGR-TYIdIMGXBcOklGHgB6Q5_4P_Nt24-n4i3sqWaL6UKI6XrzmxerziTBTEy-Wx5ERUyl-wXnfcD3exUrUQjduFtwJ__BGEYhpZsZAblc069ZD1vhL3GGTgmIbYoebcwjkdsF"
              alt="Admin avatar"
            />
            <div>
              <p className="text-sm font-medium text-[#111318] dark:text-white">
                Jane Smith
              </p>
              <p className="text-sm text-[#637088] dark:text-gray-400">
                Team has been dispatched to assess the situation.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                April 24, 2024 - 9:05 AM
              </p>
            </div>
          </div>

          {/* Comment 2 */}
          <div className="flex gap-3">
            <img
              className="size-8 rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC390iN7eGBaBhr6CUjNisfUKnslrPseKd_tut5AgJi-t9qz69rzbh80R7DiqZniBLH7FH3YUy3lUJSk4jbs3cV7xcVGvrWs4yrwZ7qiGx79fac4hcv80JzM0jcAVG-OhyyI5J_3JfOI02sRpC_la9rfc5_sm7CZDkSC5r1yskrZ55sbEcvV2HAo2rP53nNPhk-W9GYIDDG5yiTtWZkuZmJEBm32SHuDU51iyJAb3Ys9oGmTpRySiBNmkmQQhsqYxTWwwE4C5LW87la"
              alt="Admin avatar"
            />
            <div>
              <p className="text-sm font-medium text-[#111318] dark:text-white">
                Mike Johnson
              </p>
              <p className="text-sm text-[#637088] dark:text-gray-400">
                Confirmed. Awaiting parts for the repair.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                April 24, 2024 - 2:30 PM
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Add Comment */}
      <div className="mt-6">
        <textarea
          rows="3"
          placeholder="Add a comment..."
          className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white focus:border-primary focus:ring-primary"
        ></textarea>
        <button className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90">
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
