import React, { useEffect, useState } from "react";
import ReportsTable from "./ReportsTable";
import StatsCard from "./StatsCard";
import api from "../../axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats data when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("api/issues/stats/");
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Reports", value: stats.total },
    { title: "Pending", value: stats.pending },
    { title: "In Progress", value: stats.inProgress },
    { title: "Resolved", value: stats.resolved },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <div className="mb-8">
        <p className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Administrator Dashboard
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <p className="text-slate-700 dark:text-slate-300">Loading stats...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">Error loading stats.</p>
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

      {/* Recent Reports Table */}
      <div className="bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <ReportsTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
