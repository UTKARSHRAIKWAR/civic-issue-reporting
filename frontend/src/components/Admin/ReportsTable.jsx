// import React, { useState, useEffect } from "react";
// import api from "../../axios";
// import { ReportRow } from "./ReportRow";

// const FilterButton = ({ text }) => (
//   <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
//     <p className="text-sm font-medium">{text}</p>
//     <span className="material-symbols-outlined text-base">expand_more</span>
//   </button>
// );

// function ReportsTable() {
//   // 2. Set up state for reports, loading, and errors
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 3. Fetch data when the component mounts
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         // Use axios to get data from your API endpoint
//         const response = await api.get("api/issues/");

//         // The data is usually in response.data
//         setReports(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []); // The empty array [] means this effect runs once after the component mounts

//   // console.log(reports);

//   // 4. Handle loading state
//   if (loading) {
//     return (
//       <div className="p-6 text-center text-slate-500 dark:text-slate-400">
//         Loading reports...
//       </div>
//     );
//   }

//   // 5. Handle error state
//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Error fetching reports: {error}
//       </div>
//     );
//   }

//   // 6. Render the table with the fetched data
//   return (
//     <>
//       {/* Section Header with Filters (same as before) */}
//       <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
//         <h2 className="text-slate-800 dark:text-white text-xl font-bold leading-tight">
//           Recent Reports
//         </h2>
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
//             Filter by:
//           </span>
//           <FilterButton text="Status" />
//           <FilterButton text="Area" />
//           <FilterButton text="Department" />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
//           <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
//             <tr>
//               <th scope="col" className="px-6 py-3">
//                 Issue Title
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Location
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Reported Date
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Department
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Map over the 'reports' state variable */}
//             {reports.length > 0 ? (
//               reports.map((report) => (
//                 // Use a unique id from your data as the key
//                 <ReportRow key={report.id || report._id} report={report} />
//               ))
//             ) : (
//               // Show a message if no reports are found
//               <tr className="bg-white dark:bg-slate-900/70">
//                 <td colSpan="6" className="px-6 py-4 text-center">
//                   No reports found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// export default ReportsTable;

import React, { useState, useEffect } from "react";
import api from "../../axios";
import { ReportRow } from "./ReportRow";

const FilterButton = ({ text }) => (
  <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">
    <p className="text-sm font-medium">{text}</p>
    <span className="material-symbols-outlined text-base">expand_more</span>
  </button>
);

function ReportsTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all reports (for admin)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/api/issues"); // use secured admin route
        setReports(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error fetching reports: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/70 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header with Filters */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-slate-800 dark:text-white text-lg sm:text-xl font-bold">
          Recent Reports
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
            Filter by:
          </span>
          <FilterButton text="Status" />
          <FilterButton text="Area" />
          <FilterButton text="Department" />
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Issue Title
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Reported Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <ReportRow key={report.id || report._id} report={report} />
              ))
            ) : (
              <tr className="bg-white dark:bg-slate-900/70">
                <td colSpan="6" className="px-6 py-4 text-center">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="block md:hidden p-4 space-y-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id || report._id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {report.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                📍 {report?.location?.name || "No location"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                🕓 {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    report.status === "Resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : report.status === "InProgress"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {report.status}
                </span>
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {report.department || "Unassigned"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No reports found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportsTable;
