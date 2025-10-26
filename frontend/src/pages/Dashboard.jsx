// import React, { useEffect, useState, useMemo } from "react";
// import api from "../axios";
// import Header from "../components/Header";
// import IssueItem from "../components/IssueItem";
// import { toast } from "sonner";
// import AddIssueButton from "../components/AddIssueButton";
// import Map from "../components/Map";
// import Skeleton from "../components/Skeleton";
// import { useSearch } from "../context/SearchContext";

// const Dashboard = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { searchQuery } = useSearch(); // global search query

//   // Fetch issues from backend
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

//   // 🔍 Filter issues based on global search
//   const filteredIssues = useMemo(() => {
//     if (!searchQuery.trim()) return issues;
//     const query = searchQuery.toLowerCase();
//     return issues.filter(
//       (issue) =>
//         issue.title?.toLowerCase().includes(query) ||
//         issue.category?.toLowerCase().includes(query) ||
//         issue.location?.name?.toLowerCase().includes(query)
//     );
//   }, [issues, searchQuery]);

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
//             className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }

//     if (filteredIssues.length > 0) {
//       return (
//         <div className="space-y-3">
//           {filteredIssues.map((issue) => (
//             <IssueItem key={issue._id} issue={issue} />
//           ))}
//         </div>
//       );
//     }

//     return (
//       <p className="py-6 text-center text-gray-500 dark:text-gray-400">
//         No issues found for “{searchQuery}”.
//       </p>
//     );
//   };

//   return (
//     <div className="bg-slate-100 dark:bg-slate-900 font-display">
//       <div className="relative flex min-h-screen w-full flex-col">
//         <Header />
//         <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-screen-xl rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 md:p-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
//               {/* Left Section - Issue List */}
//               <div className="lg:col-span-2">
//                 <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
//                   Recent Reports
//                 </h2>
//                 {renderContent()}
//               </div>

//               {/* Right Section - Map */}
//               <div className="hidden lg:block lg:col-span-1">
//                 <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
//                   Issue Map
//                 </h2>
//                 <div className="sticky top-24">
//                   <Map issues={filteredIssues} zoom={12} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <AddIssueButton />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useMemo } from "react";
import api from "../axios";
import Header from "../components/Header";
import IssueItem from "../components/IssueItem";
import { toast } from "sonner";
import AddIssueButton from "../components/AddIssueButton";
import Map from "../components/Map";
import Skeleton from "../components/Skeleton";
import { useSearch } from "../context/SearchContext";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();

  // Detect screen size for mobile safety
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
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

  const filteredIssues = useMemo(() => {
    if (!searchQuery.trim()) return issues;
    const query = searchQuery.toLowerCase();
    return issues.filter(
      (issue) =>
        issue.title?.toLowerCase().includes(query) ||
        issue.category?.toLowerCase().includes(query) ||
        issue.location?.name?.toLowerCase().includes(query)
    );
  }, [issues, searchQuery]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
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

    if (filteredIssues.length > 0) {
      return (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueItem key={issue._id} issue={issue} />
          ))}
        </div>
      );
    }

    return (
      <p className="py-6 text-center text-gray-500 dark:text-gray-400">
        No issues found for “{searchQuery}”.
      </p>
    );
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 font-display">
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-xl rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
              {/* Left: Issue List */}
              <div className="lg:col-span-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                  Recent Reports
                </h2>
                {renderContent()}
              </div>

              {/* Right: Map (Disabled on Mobile) */}
              {!isMobile && (
                <div className="hidden lg:block lg:col-span-1">
                  <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                    Issue Map
                  </h2>
                  <div className="sticky top-24">
                    <Map issues={filteredIssues} zoom={12} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <AddIssueButton />
      </div>
    </div>
  );
};

export default Dashboard;
