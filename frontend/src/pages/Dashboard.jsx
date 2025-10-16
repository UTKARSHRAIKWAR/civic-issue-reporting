// import React, { useEffect, useState } from "react";
// import api from "../axios";
// import Header from "../components/Header";
// import IssueItem from "../components/IssueItem";
// import { toast } from "sonner";
// import AddIssueButton from "../components/AddIssueButton";
// import Map from "../components/Map";

// const Dashboard = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchIssues = async () => {
//     try {
//       const { data } = await api.get("/api/issues/");

//       setIssues(data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch issues. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display">
//       <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
//         <div className="layout-container flex h-full grow flex-col">
//           <Header />

//           <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left Section - Issue List */}
//               <div className="lg:col-span-2">
//                 <h2 className="text-gray-800 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
//                   Recent Reports
//                 </h2>

//                 {loading ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400 py-6">
//                     Loading issues...
//                   </p>
//                 ) : issues.length > 0 ? (
//                   <div className="space-y-4">
//                     {issues.map((issue) => (
//                       <IssueItem key={issue._id} issue={issue} />
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 dark:text-gray-400 py-6">
//                     No issues found.
//                   </p>
//                 )}
//               </div>

//               {/* Right Section - Map */}
//               <Map zoom={12} />
//             </div>
//           </main>
//           <AddIssueButton />
//         </div>
//       </div>
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

// A new Skeleton component for a better loading experience
const IssueItemSkeleton = () => (
  <div className="w-full max-w-4xl px-4 py-2">
    <div className="flex animate-pulse items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="mt-2 h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div className="h-28 w-40 flex-shrink-0 rounded-md bg-slate-200 dark:bg-slate-700"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for handling fetch errors

  const fetchIssues = async () => {
    setLoading(true);
    setError(null); // Reset error state on new fetch
    try {
      const { data } = await api.get("/api/issues/");
      setIssues(data);
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

  // Helper function to render the main content based on state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {/* Show multiple skeletons to represent a list */}
          <IssueItemSkeleton />
          <IssueItemSkeleton />
          <IssueItemSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchIssues}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (issues.length > 0) {
      return (
        <div className="space-y-4">
          {issues.map((issue) => (
            <IssueItem key={issue._id} issue={issue} />
          ))}
        </div>
      );
    }

    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
        No issues have been reported yet.
      </p>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 font-display">
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
            {/* Left Section - Issue List */}
            <div className="lg:col-span-2">
              <h2 className="text-gray-800 dark:text-white text-2xl font-bold px-4 pb-3 pt-5">
                Recent Reports
              </h2>
              {renderContent()}
            </div>

            {/* Right Section - Map */}
            {/* Consider passing issues to the Map to display markers */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <Map issues={issues} zoom={12} />
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
