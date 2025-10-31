// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import api from "../../axios";

// import SideBar from "./SideBar";
// import Map from "../Map";
// import Comments, { Timeline } from "./Comments";

// const IssueDetail = () => {
//   const { id } = useParams();
//   const [issue, setIssue] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [statusLoading, setStatusLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchIssue = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//         const token = userInfo?.token;
//         const role = userInfo?.user?.role;

//         if (!token) {
//           toast.error("Unauthorized: Please log in");
//           navigate("/login");
//           return;
//         }

//         if (role !== "admin") {
//           toast.error("Access denied: Admins only");
//           navigate("/");
//           return;
//         }

//         setLoading(true);
//         const { data } = await api.get(`/api/issues/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setIssue(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch issue details.");
//         toast.error(
//           err.response?.data?.message || "Failed to fetch issue details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssue();
//   }, [id, navigate]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
//         <div className="flex flex-col items-center gap-4 text-gray-700 dark:text-gray-300">
//           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-lg font-medium">Loading issue details...</p>
//         </div>
//       </div>
//     );

//   if (error) return <p className="p-6 text-red-500">{error}</p>;
//   if (!issue) return <p className="p-6">No issue found.</p>;

//   const photos = Array.isArray(issue.fileUrl)
//     ? issue.fileUrl
//     : issue.fileUrl
//     ? [issue.fileUrl]
//     : [];

//   // 🟢 Handle status change (Admin Only)
//   const handleStatusChange = async (e) => {
//     const newStatus = e.target.value;
//     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//     const token = userInfo?.token;

//     if (!token) {
//       toast.error("Unauthorized: Please log in");
//       return;
//     }

//     setStatusLoading(true);
//     try {
//       await api.patch(
//         `/api/issues/${id}/status`,
//         { newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setIssue((prev) => ({ ...prev, status: newStatus }));
//       toast.success(`Status changed to "${newStatus}".`);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to update status.");
//     } finally {
//       setStatusLoading(false);
//     }
//   };

//   // 🔴 Handle delete issue (Admin Only)
//   const handleClose = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this issue?"
//     );
//     if (!confirmDelete) return;

//     setDeleteLoading(true);
//     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//     const token = userInfo?.token;

//     if (!token) {
//       toast.error("Unauthorized: Please log in");
//       setDeleteLoading(false);
//       return;
//     }

//     try {
//       await api.delete(`/api/issues/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Issue deleted successfully.");
//       navigate("/admin-dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete issue.");
//       toast.error(err.response?.data?.message || "Failed to delete issue.");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
//       <main className="flex-1 p-8">
//         {/* 🟢 Mobile Back Button */}
//         <div className="block md:hidden mb-4">
//           <button
//             onClick={() => navigate("/admin-dashboard")}
//             className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
//           >
//             <span className="material-symbols-outlined text-base">
//               arrow_back
//             </span>
//             Back
//           </button>
//         </div>

//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Header */}
//             <div className="flex flex-wrap justify-between items-start gap-4">
//               <div className="flex flex-col gap-2">
//                 <p className="text-[#111318] dark:text-white text-4xl font-black tracking-tighter">
//                   {issue.title}
//                 </p>
//                 <p className="text-[#637088] dark:text-gray-400 text-base">
//                   Submitted on {new Date(issue.createdAt).toLocaleDateString()}{" "}
//                   by {issue.email}
//                 </p>
//               </div>

//               {/* 🟡 Status Dropdown */}
//               <div className="flex flex-col gap-1">
//                 <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">
//                   Status
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <select
//                     value={issue.status}
//                     onChange={handleStatusChange}
//                     disabled={statusLoading}
//                     className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
//                       statusLoading
//                         ? "opacity-70 cursor-not-allowed"
//                         : "cursor-pointer"
//                     } ${
//                       issue.status === "Open"
//                         ? "border-green-400 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
//                         : issue.status === "InProgress"
//                         ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
//                         : issue.status === "Resolved"
//                         ? "border-blue-400 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
//                         : "border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
//                     }`}
//                   >
//                     <option value="Open">Open</option>
//                     <option value="InProgress">In Progress</option>
//                     <option value="Resolved">Resolved</option>
//                     <option value="Pending">Pending</option>
//                   </select>

//                   {statusLoading && (
//                     <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
//                       <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                       <span>Updating...</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Issue Details */}
//             <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
//               <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
//                 Issue Details
//               </h2>
//               <p className="text-[#111318] dark:text-gray-300 text-base leading-relaxed">
//                 {issue.description}
//               </p>
//             </div>

//             {/* Photos */}
//             {photos.length > 0 && (
//               <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
//                 <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
//                   Photos
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {photos.map((photo, idx) => (
//                     <div
//                       key={idx}
//                       className="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-lg"
//                       style={{ backgroundImage: `url(${photo})` }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Map */}
//             <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
//               <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
//                 Location
//               </h2>
//               <Map
//                 issues={[issue]}
//                 initialPosition={[
//                   issue.location?.latitude || 23.2599,
//                   issue.location?.longitude || 77.4126,
//                 ]}
//               />
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
//               <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
//                 Assign to Department
//               </h2>
//               <select className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white focus:border-primary focus:ring-primary">
//                 <option>Select a department</option>
//                 <option>Public Works</option>
//                 <option>Water Department</option>
//                 <option>Transportation</option>
//               </select>
//             </div>

//             <Timeline />
//             <Comments />
//           </div>

//           {/* Footer Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button
//               disabled={deleteLoading}
//               onClick={handleClose}
//               className={`px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 ml-auto ${
//                 deleteLoading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {deleteLoading ? "Deleting..." : "Delete Issue"}
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default IssueDetail;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../axios";

import SideBar from "./SideBar";
import Map from "../Map";
import Comments, { Timeline } from "./Comments";

const IssueDetail = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const token = userInfo?.token;
        const role = userInfo?.user?.role;

        if (!token) {
          toast.error("Unauthorized: Please log in");
          navigate("/login");
          return;
        }

        if (role !== "admin") {
          toast.error("Access denied: Admins only");
          navigate("/");
          return;
        }

        setLoading(true);
        const { data } = await api.get(`/api/issues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIssue(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch issue details.");
        toast.error(
          err.response?.data?.message || "Failed to fetch issue details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4 text-gray-700 dark:text-gray-300">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Loading issue details...</p>
        </div>
      </div>
    );

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!issue) return <p className="p-6">No issue found.</p>;

  const photos = Array.isArray(issue.fileUrl)
    ? issue.fileUrl
    : issue.fileUrl
    ? [issue.fileUrl]
    : [];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = userInfo?.token;

    if (!token) {
      toast.error("Unauthorized: Please log in");
      return;
    }

    setStatusLoading(true);
    try {
      await api.patch(
        `/api/issues/${id}/status`,
        { newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIssue((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status changed to "${newStatus}".`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleClose = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue?"
    );
    if (!confirmDelete) return;

    setDeleteLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = userInfo?.token;

    if (!token) {
      toast.error("Unauthorized: Please log in");
      setDeleteLoading(false);
      return;
    }

    try {
      await api.delete(`/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Issue deleted successfully.");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to delete issue.");
      toast.error(err.response?.data?.message || "Failed to delete issue.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 p-6 sm:p-8">
        {/* 🟢 Back Button (Visible on all screens) */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              arrow_back
            </span>
            Back to Dashboard
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[#111318] dark:text-white text-3xl sm:text-4xl font-black tracking-tighter">
                  {issue.title}
                </p>
                <p className="text-[#637088] dark:text-gray-400 text-base">
                  Submitted on {new Date(issue.createdAt).toLocaleDateString()}{" "}
                  by {issue.email}
                </p>
              </div>

              {/* 🟡 Status Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={issue.status}
                    onChange={handleStatusChange}
                    disabled={statusLoading}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      statusLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      issue.status === "Open"
                        ? "border-green-400 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : issue.status === "InProgress"
                        ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        : issue.status === "Resolved"
                        ? "border-blue-400 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-400 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending">Pending</option>
                  </select>

                  {statusLoading && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Issue Details
              </h2>
              <p className="text-[#111318] dark:text-gray-300 text-base leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Photos */}
            {photos.length > 0 && (
              <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                  Photos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-lg"
                      style={{ backgroundImage: `url(${photo})` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
                Location
              </h2>
              <Map
                issues={[issue]}
                initialPosition={[
                  issue.location?.latitude || 23.2599,
                  issue.location?.longitude || 77.4126,
                ]}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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

            <Timeline />
            <Comments />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              disabled={deleteLoading}
              onClick={handleClose}
              className={`px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 ml-auto ${
                deleteLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetail;
