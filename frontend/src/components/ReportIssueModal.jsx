// import {
//   SpinnerIcon,
//   CloseIcon,
//   CheckCircleIcon,
// } from "../components/ui/Icons";
// import React, { useState, useEffect, useRef } from "react";
// import api from "../axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import UploadSection from "./UploadSection"; // ✅ Modern upload section

// // Fix leaflet marker icons
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// // Issue categories
// const issueTypes = [
//   "Road Damage",
//   "Streetlight Issue",
//   "Garbage Not Collected",
//   "Drainage / Sewage Issue",
//   "Power Outage",
//   "Air / Water Pollution",
//   "Illegal Parking",
//   "Public Nuisance / Safety Concern",
//   "Others",
// ];

// const ReportIssueForm = () => {
//   const [title, setTitle] = useState("");
//   const [selectedIssue, setSelectedIssue] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [notifyByEmail, setNotifyByEmail] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [reportSubmitted, setReportSubmitted] = useState(false);
//   const [locationInput, setLocationInput] = useState("");
//   const [locationCoords, setLocationCoords] = useState(null);

//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//   const token = userInfo?.token;
//   const email = userInfo?.user?.email;

//   const mapRef = useRef(null);
//   const markerRef = useRef(null);

//   // Initialize Map
//   useEffect(() => {
//     if (mapRef.current) return;

//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) return;

//     mapRef.current = L.map(mapContainer).setView([22.7196, 75.8577], 13);

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap contributors",
//     }).addTo(mapRef.current);

//     setTimeout(() => mapRef.current.invalidateSize(), 100);

//     navigator.geolocation?.getCurrentPosition(
//       ({ coords }) => {
//         const { latitude, longitude } = coords;
//         setLocationCoords({ lat: latitude, lng: longitude });
//         mapRef.current.setView([latitude, longitude], 15);
//         markerRef.current = L.marker([latitude, longitude]).addTo(
//           mapRef.current
//         );
//       },
//       () => toast.info("Could not fetch your location. Select manually.")
//     );

//     mapRef.current.on("click", (e) => {
//       setLocationCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
//     });

//     return () => {
//       mapRef.current?.remove();
//       mapRef.current = null;
//     };
//   }, []);

//   // Update marker when location changes
//   useEffect(() => {
//     if (!mapRef.current || !locationCoords) return;

//     const { lat, lng } = locationCoords;

//     if (!markerRef.current) {
//       markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
//     } else {
//       markerRef.current.setLatLng([lat, lng]);
//     }
//   }, [locationCoords]);

//   // Smooth Locate Me
//   const handleLocateMe = () => {
//     if (!navigator.geolocation)
//       return toast.error("Geolocation not supported by this browser.");

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => {
//         const { latitude, longitude } = coords;
//         setLocationCoords({ lat: latitude, lng: longitude });

//         // Smooth pan animation
//         mapRef.current.flyTo([latitude, longitude], 15, {
//           animate: true,
//           duration: 1.5,
//         });

//         // Smooth marker update
//         if (markerRef.current) {
//           markerRef.current.setLatLng([latitude, longitude]);
//         } else {
//           markerRef.current = L.marker([latitude, longitude]).addTo(
//             mapRef.current
//           );
//         }
//         toast.success("Location updated!");
//       },
//       () => toast.error("Unable to fetch your location.")
//     );
//   };

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) return toast.error("Please log in to report an issue.");
//     if (!title.trim()) return toast.error("Please enter a title.");
//     if (!selectedIssue) return toast.error("Please select a category.");
//     if (!description.trim()) return toast.error("Please add a description.");
//     if (!locationCoords)
//       return toast.error("Please select a location on the map.");

//     const locationData = {
//       name: locationInput || "Not provided",
//       latitude: locationCoords.lat,
//       longitude: locationCoords.lng,
//     };

//     const formData = new FormData();
//     formData.append("title", title.trim());
//     formData.append("category", selectedIssue);
//     formData.append("description", description.trim());
//     formData.append("location", JSON.stringify(locationData));
//     formData.append("notifyByEmail", notifyByEmail);
//     if (email) formData.append("email", email);
//     if (file) formData.append("file", file);

//     setLoading(true);
//     try {
//       await api.post("/api/issues", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReportSubmitted(true);
//       toast.success("Issue reported successfully!");
//       setTimeout(() => navigate("/dashboard"), 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto"
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-4 md:p-6">
//           <h2 className="text-xl md:text-2xl font-semibold">
//             Report a Civic Issue
//           </h2>
//           <button
//             type="button"
//             onClick={() => navigate("/dashboard")}
//             className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-500 transition-colors"
//           >
//             <CloseIcon />
//           </button>
//         </div>

//         <div className="p-4 md:p-6 space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
//               Title
//             </label>
//             <input
//               type="text"
//               placeholder="e.g., Pothole on main road"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           {/* Location Section */}
//           <div>
//             <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
//               Location
//             </label>
//             <div
//               id="map"
//               className="h-64 w-full rounded-lg mb-3 border border-slate-300 dark:border-slate-700"
//             />
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={locationInput}
//                 onChange={(e) => setLocationInput(e.target.value)}
//                 placeholder="Add address or landmark"
//                 className="flex-1 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary"
//               />
//               <button
//                 type="button"
//                 onClick={handleLocateMe}
//                 className="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap"
//               >
//                 Locate Me
//               </button>
//             </div>
//           </div>

//           {/* Upload + Description */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
//                 Upload Photo
//               </label>
//               <UploadSection onFileSelect={setFile} />
//             </div>

//             <div className="flex flex-col space-y-4">
//               <div>
//                 <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
//                   Category
//                 </label>
//                 <select
//                   value={selectedIssue}
//                   onChange={(e) => setSelectedIssue(e.target.value)}
//                   className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="">Select a category...</option>
//                   {issueTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
//                   Description
//                 </label>
//                 <textarea
//                   rows={5}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Describe the issue clearly..."
//                   className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Success */}
//           {reportSubmitted && (
//             <div className="flex items-center p-4 text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300 rounded-lg">
//               <CheckCircleIcon />
//               <span className="font-medium ml-2">
//                 Report submitted! Redirecting...
//               </span>
//             </div>
//           )}

//           {/* Footer */}
//           <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 pt-4 pb-4 md:pb-6 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <label className="flex items-center text-slate-600 dark:text-slate-300">
//               <input
//                 type="checkbox"
//                 checked={notifyByEmail}
//                 onChange={(e) => setNotifyByEmail(e.target.checked)}
//                 className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
//               />
//               <span className="ml-2 text-sm">Notify me by email</span>
//             </label>

//             <button
//               type="submit"
//               disabled={loading || reportSubmitted}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
//             >
//               {loading ? <SpinnerIcon /> : "Submit Report"}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ReportIssueForm;

import React, { useState, useEffect, useRef } from "react";
import {
  SpinnerIcon,
  CloseIcon,
  CheckCircleIcon,
} from "../components/ui/Icons";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import UploadSection from "./UploadSection";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
  const [title, setTitle] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [locationCoords, setLocationCoords] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const email = userInfo?.user?.email;

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current) return;
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    mapRef.current = L.map(mapContainer).setView([22.7196, 75.8577], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    setTimeout(() => mapRef.current.invalidateSize(), 100);

    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        mapRef.current.setView([latitude, longitude], 15);
        markerRef.current = L.marker([latitude, longitude]).addTo(
          mapRef.current
        );
      },
      () => toast.info("Could not fetch your location. Select manually.")
    );

    mapRef.current.on("click", (e) => {
      setLocationCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker
  useEffect(() => {
    if (!mapRef.current || !locationCoords) return;
    const { lat, lng } = locationCoords;
    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [locationCoords]);

  // Smooth Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation)
      return toast.error("Geolocation not supported by this browser.");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocationCoords({ lat: latitude, lng: longitude });
        mapRef.current.flyTo([latitude, longitude], 15, {
          animate: true,
          duration: 1.5,
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.marker([latitude, longitude]).addTo(
            mapRef.current
          );
        }
        toast.success("Location updated!");
      },
      () => toast.error("Unable to fetch your location.")
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please log in to report an issue.");
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!selectedIssue) return toast.error("Please select a category.");
    if (!description.trim()) return toast.error("Please add a description.");
    if (!locationCoords)
      return toast.error("Please select a location on the map.");

    const locationData = {
      name: locationInput || "Not provided",
      latitude: locationCoords.lat,
      longitude: locationCoords.lng,
    };

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", selectedIssue);
    formData.append("description", description.trim());
    formData.append("location", JSON.stringify(locationData));
    formData.append("notifyByEmail", notifyByEmail);
    if (email) formData.append("email", email);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      await api.post("/api/issues", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportSubmitted(true);
      toast.success("Issue reported successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-3 sm:p-5">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Report a Civic Issue
          </h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-500 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1">
          {/* Title */}
          <div>
            <label className="block mb-1 sm:mb-2 font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Pothole on main road"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 sm:mb-2 font-medium text-slate-700 dark:text-slate-300">
              Location
            </label>
            <div
              id="map"
              className="h-56 sm:h-64 w-full rounded-lg mb-3 border border-slate-300 dark:border-slate-700"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Add address or landmark"
                className="flex-1 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={handleLocateMe}
                className="px-4 py-2 bg-primary text-white rounded-lg whitespace-nowrap text-sm sm:text-base"
              >
                Locate Me
              </button>
            </div>
          </div>

          {/* Upload + Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 sm:mb-2 font-medium text-slate-700 dark:text-slate-300">
                Upload Photo
              </label>
              <UploadSection onFileSelect={setFile} />
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary text-sm sm:text-base"
                >
                  <option value="">Select a category...</option>
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue clearly..."
                  className="w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Success */}
          {reportSubmitted && (
            <div className="flex items-center p-4 text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300 rounded-lg">
              <CheckCircleIcon />
              <span className="font-medium ml-2 text-sm sm:text-base">
                Report submitted! Redirecting...
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 pt-3 pb-3 sm:pb-5 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <label className="flex items-center text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            <input
              type="checkbox"
              checked={notifyByEmail}
              onChange={(e) => setNotifyByEmail(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
            />
            <span className="ml-2">Notify me by email</span>
          </label>

          <button
            type="submit"
            disabled={loading || reportSubmitted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
          >
            {loading ? <SpinnerIcon /> : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssueForm;
