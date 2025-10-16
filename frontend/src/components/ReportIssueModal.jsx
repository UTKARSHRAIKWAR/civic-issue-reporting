import React, { useState, useEffect, useRef } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Icons ---
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UploadCloudIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const SpinnerIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// --- Issue Types ---
const issueTypes = [
  "Road Damage",
  "Streetlight Issue",
  "Footpath / Sidewalk Damage",
  "Open Manhole",
  "Traffic Signal Problem",
  "Garbage Not Collected",
  "Overflowing Dustbin",
  "Illegal Waste Dumping",
  "Drainage / Sewage Issue",
  "Stagnant Water / Foul Smell",
  "Water Leakage / Pipe Burst",
  "No Water Supply",
  "Contaminated Water",
  "Power Outage",
  "Exposed Wires",
  "Tree Fallen / Blocking Road",
  "Park Maintenance Issue",
  "Illegal Tree Cutting",
  "Air / Water Pollution",
  "Noise Pollution",
  "Broken Public Property",
  "Damaged Bus Stop / Shelter",
  "Missing or Broken Signboard",
  "Illegal Parking",
  "Encroachment",
  "Vandalism / Graffiti",
  "Public Nuisance / Safety Concern",
  "Stray Animal Issue",
  "Poor Municipal Response",
  "Corruption / Misconduct",
  "Grievance Not Resolved",
  "Accessibility Issue",
  "Event / Crowd Disturbance",
  "Community Facility Issue",
  "Others",
];

const ReportIssueForm = () => {
  const [title, setTitle] = useState(""); // NEW title field
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [locationInput, setLocationInput] = useState("");
  const [locationCoords, setLocationCoords] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const email = userInfo?.user?.email;

  const dropRef = useRef();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // --- Handle File Preview ---
  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // --- Initialize Map and Get Current Location ---
  useEffect(() => {
    if (mapRef.current) return; // prevent re-init
    mapRef.current = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapRef.current);

    // Fetch current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocationCoords({ lat, lng });

          mapRef.current.setView([lat, lng], 15);
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
        },
        () => toast.error("Unable to fetch your current location.")
      );
    }

    // Map click for manual pin
    mapRef.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLocationCoords({ lat, lng });
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    });
  }, []);

  // --- Drag & Drop File ---
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-primary", "bg-primary/10");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile?.type.startsWith("image/"))
      return toast.error("Only image files are allowed.");
    if (droppedFile.size > 5 * 1024 * 1024)
      return toast.error("File size exceeds 5MB.");
    setFile(droppedFile);
  };
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected?.type.startsWith("image/"))
      return toast.error("Only image files are allowed.");
    if (selected.size > 5 * 1024 * 1024)
      return toast.error("File size exceeds 5MB.");
    setFile(selected);
  };
  const handleRemoveFile = () => setFile(null);

  // --- Submit Form ---
  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return toast.error("You must be logged in.");
    if (!selectedIssue) return toast.error("Please select a category.");
    if (!title.trim()) return toast.error("Please provide a title.");
    if (!description.trim())
      return toast.error("Please provide a description.");

    // Construct location object
    const locationField = {
      name: locationInput || "Not provided",
      latitude: locationCoords?.lat || null,
      longitude: locationCoords?.lng || null,
    };

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", selectedIssue); // send as category
    formData.append("description", description.trim());
    formData.append("location", JSON.stringify(locationField)); // stringify object
    if (email) formData.append("email", email);
    formData.append("notifyByEmail", notifyByEmail);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await api.post("/api/issues", formData, config);
      console.log("Submitted:", data);
      setReportSubmitted(true);
      toast.success("Report submitted successfully!");

      // Reset form
      setTitle("");
      setSelectedIssue("");
      setDescription("");
      setFile(null);
      setLocationInput("");
      setLocationCoords(null);
      setNotifyByEmail(false);

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit report.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg w-full max-w-4xl p-6 md:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
          <h2 className="text-2xl font-semibold">Report a New Issue</h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-red-500"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for the issue"
            className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Map + Location Input */}
        <div>
          <label className="block mb-2 font-medium">Location</label>
          <div
            id="map"
            className="h-64 w-full rounded-lg mb-3 border border-slate-300 dark:border-slate-700"
          />
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Type location (optional)"
            className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Photo & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload */}
          <div>
            <label className="block mb-2 font-medium">
              Upload a Photo (Optional)
            </label>
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex={0}
              className="border-2 border-dashed rounded-lg h-56 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <UploadCloudIcon />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Click or drag to upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows={8}
              className="w-full p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            className="w-full h-12 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {issueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Notify */}
        <div className="flex items-center">
          <input
            id="notify"
            type="checkbox"
            checked={notifyByEmail}
            onChange={(e) => setNotifyByEmail(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
          />
          <label htmlFor="notify" className="ml-2 text-sm cursor-pointer">
            Notify me by email
          </label>
        </div>

        {/* Success */}
        {reportSubmitted && (
          <div className="flex items-center p-4 text-green-700 bg-green-100 rounded-lg">
            <CheckCircleIcon />
            <span className="ml-2 font-medium">
              Report submitted successfully!
            </span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {loading ? <SpinnerIcon /> : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssueForm;
