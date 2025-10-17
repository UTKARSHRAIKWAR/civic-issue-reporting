import React from "react";
import SideBar from "../components/SideBar";

const IssueDetail = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* sidebar */}
      <SideBar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[#111318] dark:text-white text-4xl font-black tracking-tighter">
                  Water Leak at Main Street
                </p>
                <p className="text-[#637088] dark:text-gray-400 text-base">
                  Submitted on 2024-04-23 by John Doe
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-green-100 dark:bg-green-900/30 px-4">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                    Open
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Issue Details
              </h2>
              <p className="text-[#111318] dark:text-gray-300 text-base leading-relaxed">
                A significant water leak has been reported at the intersection
                of Main Street and 2nd Avenue. The leak is causing a large
                puddle to form, posing a potential hazard to pedestrians and
                vehicles. Immediate attention is required to prevent further
                water loss and potential damage to the road.
              </p>
            </div>

            {/* Photos */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Photos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-lg"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGUnr5UNGDDrHO_WOpczGjrLdssQ9BHiHZIKVX36G5JVC1Y9Wla4BT6AI4D_yealg3u4f24sh7DHgR9uZ_kEiOawaSd3koyp3azqjacAAgh0QeXw_ZgXbiGQKnIVe0Vg6E8ixBPIN6rKc19XvuOGy381Gw8tC_hH548kuthZWz_XSwu-97p792D_yq-eUl7dgFEFBwXDAgao7k98oX0IHaahaidUHw16kKt86Z6lPCI5iLsmxT-zkTAqgi80V5l37HDsdxev4YsF1X")',
                  }}
                ></div>
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-lg"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCYdSEqeXWZuWoU8qj-LliGZQKyFqZj-jmlUYN9bCvnkbnPcokQpMm5ueWGgYQVQzByQgM_2VKUy0ftgHmyw55_v-TLcmtV0W4bGffAb_Yaa7zRmpRPD9ZOC9Ig2czF2kkUigfF5I5GT8DV9U5OH5xjMG9qSG4bbB2W473k98zd2u8Wbk3g5YSt02wnQhcfh8JLtPdQSwCZpYv8sc6-nntYGYXE1dsS_6Dp5FLikzX3btbyk-4gm5ig2KH1T64fFF1Aov9HAyCMYdT4")',
                  }}
                ></div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Location
              </h2>
              <div
                className="w-full h-64 bg-center bg-no-repeat bg-cover rounded-lg"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADoq2_bbJIVp5rzGkGOuqeQWivGMwfMM4V3yWTHshA2hz8k7wYrkDzx0wdoEUNoxZJYIwuPub0VtFrz3Ge74UrtgZ-kzAGCJ0ScqIm8ifk7T1LgT-ChutGIybHD1EJy6UL5_IdeQaFzrw8uTwG6Sc41NJe4-RUdNiSJhNNGLyvN0qcuC4znJuIOs1HZ-Ljg1EaCBMZZRIGvoN9DTe3yaSVZwvloDtYZJVqzhYsCk68JuhlBMvhMz4cHr8XSlomEtpoxxs7O9HSWhGA")',
                }}
              ></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Assign Department */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Assign to Department
              </h2>
              <select className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white focus:border-primary focus:ring-primary">
                <option>Select a department</option>
                <option>Public Works</option>
                <option>Water Department</option>
                <option>Transportation</option>
              </select>
            </div>

            {/* Timeline */}
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

            {/* Comments */}
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

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                Mark as Resolved
              </button>
              <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-[#111318] dark:text-white font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                Save Changes
              </button>
              <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 ml-auto">
                Close Issue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetail;
