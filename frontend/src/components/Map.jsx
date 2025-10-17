// import React, { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// const RecenterMap = ({ position }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (position) {
//       map.flyTo(position, 13, { animate: true });
//     }
//   }, [position]);
//   return null;
// };

// const Map = ({ issues }) => {
//   const [position, setPosition] = useState([23.2599, 77.4126]); // Default: Bhopal
//   const mapRef = useRef();

//   const handleLocate = () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setPosition([latitude, longitude]);
//         mapRef.current.flyTo([latitude, longitude], 13);
//       },
//       (err) => {
//         console.error(err);
//         alert("Unable to access your location");
//       }
//     );
//   };

//   return (
//     <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow">
//       {/* Locate Me button */}
//       <div className="absolute top-3 left-1/2 z-[1000] -translate-x-1/2">
//         <button
//           onClick={handleLocate}
//           className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 text-sm"
//         >
//           📍 Locate Me
//         </button>
//       </div>

//       {/* Map Display */}
//       <MapContainer
//         center={position}
//         zoom={12}
//         className="h-full w-full z-0"
//         whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <RecenterMap position={position} />

//         {/* Issue markers */}
//         {issues?.map(
//           (issue) =>
//             issue.location?.latitude &&
//             issue.location?.longitude && (
//               <Marker
//                 key={issue._id}
//                 position={[issue.location.latitude, issue.location.longitude]}
//               >
//                 <Popup>
//                   <div className="text-sm">
//                     <strong>{issue.title}</strong>
//                     <br />
//                     {issue.category}
//                     <br />
//                     {issue.location?.name || "Unknown"}
//                   </div>
//                 </Popup>
//               </Marker>
//             )
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner"; // Using a toast for errors is a better UX than alert()

// Icon fix (unchanged, still perfect)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// This component is the perfect way to control the map declaratively
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // The flyTo animation happens here, reacting to state changes
      map.flyTo(position, 13, { animate: true, duration: 1.5 });
    }
  }, [position, map]); // Added map to dependency array for correctness
  return null;
};

// ✨ IMPROVEMENT 2: Accept an initial position prop with a default value
const DEFAULT_CENTER = [23.2599, 77.4126]; // Bhopal

const Map = ({ issues, initialPosition = DEFAULT_CENTER }) => {
  // The position state drives the map's center
  const [centerPosition, setCenterPosition] = useState(initialPosition);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // ✨ IMPROVEMENT 1: Only need to set state. The RecenterMap component handles the rest.
        setCenterPosition([latitude, longitude]);
        toast.success("Location found!");
      },
      (err) => {
        console.error(err);
        toast.error("Unable to access your location");
      }
    );
  };

  return (
    <div className="relative h-[450px] w-full overflow-hidden rounded-lg shadow">
      {/* Locate Me button (unchanged) */}
      <div className="absolute top-3 left-1/2 z-[1000] -translate-x-1/2">
        <button
          onClick={handleLocate}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition hover:bg-gray-100"
        >
          <span className="material-symbols-outlined text-lg">my_location</span>
          Locate Me
        </button>
      </div>

      {/* Map Display */}
      <MapContainer
        center={centerPosition}
        zoom={12}
        className="z-0 h-full w-full"
        // ✨ IMPROVEMENT 1: No longer need whenCreated or a ref
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* This component declaratively updates the map view */}
        <RecenterMap position={centerPosition} />

        {/* Issue markers (unchanged) */}
        {issues?.map(
          (issue) =>
            issue.location?.latitude &&
            issue.location?.longitude && (
              <Marker
                key={issue._id}
                position={[issue.location.latitude, issue.location.longitude]}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{issue.title}</strong>
                    <br />
                    {issue.category}
                    <br />
                    {issue.location?.name || "Unknown"}
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
