import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../axios";
import Map from "../components/Map";
import Comments, { Timeline } from "../components/Admin/Comments";

const Details = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const token = userInfo?.token;

        if (!token) {
          toast.error("Unauthorized: Please log in");
          navigate("/login");
          return;
        }

        setLoading(true);
        const { data } = await api.get(`/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "in progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "resolved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "closed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 p-6 sm:p-8">
        {/* 🔙 Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              arrow_back
            </span>
            Back to Dashboard
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
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

              {/* Status Badge */}
              <div
                className={`flex h-8 items-center justify-center rounded-lg px-4 ${getStatusColor(
                  issue.status
                )}`}
              >
                <p className="text-sm font-medium capitalize">{issue.status}</p>
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

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Timeline />
            <Comments />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Details;
