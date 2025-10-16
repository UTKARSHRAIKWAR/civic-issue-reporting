// import React, { useEffect, useState } from "react";
// import api from "../axios";
// import Header from "../components/Header";
// import IssueItem from "../components/IssueItem";
// import { toast } from "sonner";
// import AddIssueButton from "../components/AddIssueButton";
// import Map from "../components/Map";
// import Skeleton from "../components/Skeleton";

// const Dashboard = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchIssues = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await api.get("/api/issues/");
//       setIssues(data);
//     } catch (err) {
//       console.error(err);
//       const errorMessage = "Failed to fetch issues. Please try again later.";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="space-y-3">
//           <Skeleton />
//           <Skeleton />
//           <Skeleton />
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="text-center py-6">
//           <p className="text-red-500">{error}</p>
//           <button
//             onClick={fetchIssues}
//             className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }

//     if (issues.length > 0) {
//       return (
//         <div className="space-y-3">
//           {issues.map((issue) => (
//             <IssueItem key={issue._id} issue={issue} />
//           ))}
//         </div>
//       );
//     }

//     return (
//       <p className="py-6 text-center text-gray-500 dark:text-gray-400">
//         No issues have been reported yet.
//       </p>
//     );
//   };

//   return (
//     <div className="bg-slate-100 dark:bg-slate-900 font-display min-h-screen">
//       <Header />
//       <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-screen-xl rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 md:p-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
//             {/* Left Section - Issue List */}
//             <div className="lg:col-span-2">
//               <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
//                 Recent Reports
//               </h2>
//               {renderContent()}
//             </div>

//             {/* Right Section - Map */}
//             <div className="hidden lg:block lg:col-span-1">
//               <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
//                 Issue Map
//               </h2>
//               <div className="sticky top-24">
//                 <Map issues={issues} zoom={12} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Add Issue Floating Button */}
//       <AddIssueButton />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import api from "../axios";
import Header from "../components/Header";
import IssueItem from "../components/IssueItem";
import { toast } from "sonner";
import AddIssueButton from "../components/AddIssueButton";
import Map from "../components/Map";

// Skeleton component remains the same
const IssueItemSkeleton = () => (
  <div className="flex animate-pulse items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
    <div className="flex flex-1 flex-col gap-1.5">
      <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-600"></div>
      <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-600"></div>
      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-600"></div>
      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-600"></div>
      <div className="mt-1 h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-600"></div>
    </div>
    <div className="h-24 w-36 flex-shrink-0 rounded-md bg-slate-200 dark:bg-slate-600"></div>
  </div>
);

const Dashboard = () => {
  const [issues, setIssues] = useState([]); // Master list of all issues
  const [filteredIssues, setFilteredIssues] = useState([]); // Issues to display after filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/issues/");
      setIssues(data); // Set the master list
      setFilteredIssues(data); // Set the initial list to display
    } catch (err) {
      console.error(err);
      const errorMessage = "Failed to fetch issues. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // --- Search Functionality Implementation ---
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();

    if (!lowerCaseQuery) {
      // If the search is cleared, show all issues
      setFilteredIssues(issues);
    } else {
      // Filter the master list
      const results = issues.filter((issue) => {
        const titleMatch = issue.title.toLowerCase().includes(lowerCaseQuery);
        const categoryMatch = (issue.category || "")
          .toLowerCase()
          .includes(lowerCaseQuery);
        const locationMatch = (issue.location?.name || "")
          .toLowerCase()
          .includes(lowerCaseQuery);
        return titleMatch || categoryMatch || locationMatch;
      });
      setFilteredIssues(results);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <IssueItemSkeleton />
          <IssueItemSkeleton />
          <IssueItemSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-6 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchIssues}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    // Now checks the filtered list to display items
    if (filteredIssues.length > 0) {
      return (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueItem key={issue._id} issue={issue} />
          ))}
        </div>
      );
    }

    // Distinguish between no issues at all vs. no search results
    if (issues.length > 0 && filteredIssues.length === 0) {
      return (
        <p className="py-6 text-center text-gray-500 dark:text-gray-400">
          No issues match your search.
        </p>
      );
    }

    return (
      <p className="py-6 text-center text-gray-500 dark:text-gray-400">
        No issues have been reported yet.
      </p>
    );
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 font-display">
      <div className="relative flex min-h-screen w-full flex-col">
        {/* Pass the implemented search handler to the Header */}
        <Header onSearch={handleSearch} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-xl rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Recent Reports
                </h2>
                {renderContent()}
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Issue Map
                </h2>
                <div className="sticky top-24">
                  {/* Pass filtered issues to the map to update markers */}
                  <Map issues={filteredIssues} zoom={12} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <AddIssueButton />
      </div>
    </div>
  );
};

export default Dashboard;
