// import React, { useEffect, useState } from "react";
// import ReportsTable from "./ReportsTable";
// import StatsCard from "./StatsCard";
// import api from "../../axios";
// import { toast } from "sonner";

// function AdminDashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     resolved: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch stats data when component mounts
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//         const token = userInfo?.token;
//         const role = userInfo?.user?.role;

//         if (!token) {
//           toast.error("Unauthorized: Please log in again");
//           throw new Error("Unauthorized: No token found");
//         }

//         if (role !== "admin") {
//           toast.error("Access denied: Admins only");
//           throw new Error("Forbidden: Not an admin");
//         }

//         const response = await api.get("/api/issues/stats", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setStats(response.data);
//       } catch (err) {
//         console.error("Error fetching admin stats:", err);
//         setError(err.message);
//         toast.error(err.response?.data?.message || "Failed to fetch stats");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const statCards = [
//     { title: "Total Reports", value: stats.total },
//     { title: "Pending", value: stats.pending },
//     { title: "In Progress", value: stats.inProgress },
//     { title: "Resolved", value: stats.resolved },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Page Heading */}
//       <div className="mb-8">
//         <p className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
//           Administrator Dashboard
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {loading ? (
//           <p className="text-slate-700 dark:text-slate-300">Loading stats...</p>
//         ) : error ? (
//           <p className="text-red-600 dark:text-red-400">Error: {error}</p>
//         ) : (
//           statCards.map((stat) => (
//             <StatsCard
//               key={stat.title}
//               title={stat.title}
//               value={stat.value.toLocaleString()}
//             />
//           ))
//         )}
//       </div>

//       {/* Recent Reports Table */}
//       <div className="bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
//         <ReportsTable />
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import ReportsTable from "./ReportsTable";
import StatsCard from "./StatsCard";
import api from "../../axios";
import { toast } from "sonner";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch stats when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const token = userInfo?.token;
        const role = userInfo?.user?.role;

        // ✅ Token check
        if (!token) {
          toast.error("Unauthorized: Please log in again.");
          throw new Error("Unauthorized: No token found.");
        }

        // ✅ Role check
        if (role !== "admin") {
          toast.error("Access denied: Admins only.");
          throw new Error("Forbidden: Not an admin.");
        }

        // ✅ Fetch admin stats with authorization header
        const response = await api.get("/api/issues/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError(err.message);
        toast.error(
          err.response?.data?.message || "Failed to fetch admin stats."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 🧮 Prepare cards dynamically
  const statCards = [
    { title: "Total Reports", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "In Progress", value: stats.inProgress },
    { title: "Resolved", value: stats.resolved },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Administrator Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">
          Manage and monitor civic issue reports efficiently.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {loading ? (
          <div className="col-span-4 text-center text-slate-600 dark:text-slate-400">
            Loading stats...
          </div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-500">
            Error: {error}
          </div>
        ) : (
          statCards.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value.toLocaleString()}
            />
          ))
        )}
      </div>

      {/* Reports Table Section */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
        <ReportsTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
