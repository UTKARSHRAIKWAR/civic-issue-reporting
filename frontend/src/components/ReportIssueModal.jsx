import {
  SpinnerIcon,
  CloseIcon,
  UploadCloudIcon,
  CheckCircleIcon,
} from "../components/ui/Icons"; // icons

import React, { useState, useEffect, useRef } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker fix for Vite/modern bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
  // --- States & Refs ---
  const [title, setTitle] = useState("");
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

  // --- File Preview ---
  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // --- Map Initialization ---
  useEffect(() => {
    if (mapRef.current) return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    mapRef.current = L.map(mapContainer).setView([22.7196, 75.8577], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapRef.current);

    setTimeout(() => mapRef.current.invalidateSize(), 100);

    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setLocationCoords({ lat: coords.latitude, lng: coords.longitude });
        mapRef.current.setView([coords.latitude, coords.longitude], 15);
      },
      () =>
        toast.info("Could not fetch current location. Please select manually.")
    );

    mapRef.current.on("click", (e) =>
      setLocationCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // --- Marker Management ---
  useEffect(() => {
    if (!locationCoords || !mapRef.current) return;
    const { lat, lng } = locationCoords;
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    else markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
  }, [locationCoords]);

  // --- Drag & Drop ---
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-primary", "bg-primary/10");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
  };
  const handleFileSelect = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/"))
      return toast.error("Only image files allowed.");
    if (f.size > 5 * 1024 * 1024) return toast.error("File size max 5MB.");
    setFile(f);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => handleFileSelect(e.target.files?.[0]);
  const handleRemoveFile = () => setFile(null);

  // --- Locate Me ---
  const handleLocateMe = () => {
    if (!navigator.geolocation)
      return toast.error("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationCoords({ lat: coords.latitude, lng: coords.longitude });
        mapRef.current.setView([coords.latitude, coords.longitude], 15);
      },
      () => toast.error("Could not fetch your location.")
    );
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in.");
    if (!title.trim()) return toast.error("Please provide a title.");
    if (!selectedIssue) return toast.error("Please select a category.");
    if (!description.trim())
      return toast.error("Please provide a description.");
    if (!locationCoords)
      return toast.error("Please select a location on the map.");

    const locationField = {
      name: locationInput || "Not provided",
      latitude: locationCoords.lat,
      longitude: locationCoords.lng,
    };

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", selectedIssue);
    formData.append("description", description.trim());
    formData.append("location", JSON.stringify(locationField));
    if (email) formData.append("email", email);
    formData.append("notifyByEmail", notifyByEmail);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      await api.post("/api/issues", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportSubmitted(true);
      toast.success("Report submitted successfully!");
      setTitle("");
      setSelectedIssue("");
      setDescription("");
      setFile(null);
      setLocationInput("");
      setLocationCoords(null);
      setNotifyByEmail(false);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit report.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            Report a New Issue
          </h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-500 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Large pothole on MG Road"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
              Location
            </label>
            <div
              id="map"
              className="h-64 w-full rounded-lg mb-3 border border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Add landmark or address"
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            />
            <button
              type="button"
              onClick={handleLocateMe}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Locate Me
            </button>
          </div>

          {/* Photo & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                Upload Photo
              </label>
              <div
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative border-2 border-dashed rounded-lg h-60 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 transition-colors border-slate-300 dark:border-slate-600"
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Issue preview"
                      className="w-full h-full object-contain rounded-md p-1"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-center p-4">
                    <UploadCloudIcon />
                    <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-primary">
                        Click to upload
                      </span>{" "}
                      or drag and drop
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

            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full h-12 p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                >
                  <option value="" disabled>
                    Select a category...
                  </option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the issue..."
                  className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Success Message */}
          {reportSubmitted && (
            <div className="flex items-center p-4 text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300 rounded-lg">
              <CheckCircleIcon />
              <span className="font-medium">
                Report submitted! Redirecting to dashboard...
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pt-4 pb-4 md:pb-6 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <input
                id="notify"
                type="checkbox"
                checked={notifyByEmail}
                onChange={(e) => setNotifyByEmail(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
              />
              <label
                htmlFor="notify"
                className="ml-2 text-sm cursor-pointer text-slate-600 dark:text-slate-300"
              >
                Notify me by email
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || reportSubmitted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <SpinnerIcon /> : "Submit Report"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportIssueForm;
