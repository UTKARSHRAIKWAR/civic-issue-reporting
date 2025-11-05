// import React, { useState, useRef, useEffect } from "react";
// import { LogIn, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const ProfileMenu = () => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//   const token = userInfo?.token;
//   const role = userInfo?.user?.role;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handlers
//   const handleLogin = () => navigate("/login");
//   const handleLogout = () => {
//     localStorage.removeItem("userInfo");
//     navigate("/login");
//   };

//   // Base menu for logged-in users
//   let menuItems = token
//     ? [
//         {
//           label: "Profile",
//           icon: <User size={18} />,
//           action: () => navigate("/profile"),
//         },
//       ]
//     : [
//         {
//           label: "Login",
//           icon: <LogIn size={18} />,
//           action: handleLogin,
//           primary: true,
//         },
//       ];

//   // Add Admin Dashboard link only for admins
//   if (role === "admin") {
//     menuItems.unshift({
//       label: "Admin Dashboard",
//       icon: <LayoutDashboard size={18} />,
//       action: () => navigate("/admin-dashboard"),
//     });
//   }

//   // Add Logout button for logged-in users
//   if (token) {
//     menuItems.push({
//       label: "Logout",
//       icon: <LogOut size={18} />,
//       action: handleLogout,
//       danger: true,
//     });
//   }

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Profile Button */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/70 backdrop-blur p-1.5 pr-3 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
//       >
//         <img
//           src={
//             userInfo?.user?.profilePictureUrl ||
//             "https://api.dicebear.com/8.x/thumbs/svg?seed=User"
//           }
//           alt="profile"
//           className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
//         />
//         <span className="font-medium text-sm">
//           {userInfo?.user?.username || "Profile"}
//         </span>
//       </button>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -6 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -6 }}
//             transition={{ duration: 0.18, ease: "easeOut" }}
//             className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-lg ring-1 ring-black/5 p-2 z-50 backdrop-blur-sm"
//           >
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   item.action();
//                   setOpen(false);
//                 }}
//                 className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                   item.primary
//                     ? "bg-green-600 text-white hover:bg-green-500"
//                     : item.danger
//                     ? "text-red-500 hover:bg-red-500/10"
//                     : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
//                 }`}
//               >
//                 {item.icon}
//                 {item.label}
//               </button>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ProfileMenu;



import React, { useState, useRef, useEffect } from "react";
import { LogIn, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const role = userInfo?.user?.role;
  const username = userInfo?.user?.username || "Guest";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Menu items
  let menuItems = token
    ? [
        {
          label: "Profile",
          icon: <User size={18} />,
          action: () => navigate("/profile"),
        },
      ]
    : [
        {
          label: "Login",
          icon: <LogIn size={18} />,
          action: handleLogin,
          primary: true,
        },
      ];

  if (role === "admin") {
    menuItems.unshift({
      label: "Admin Dashboard",
      icon: <LayoutDashboard size={18} />,
      action: () => navigate("/admin-dashboard"),
    });
  }

  if (token) {
    menuItems.push({
      label: "Logout",
      icon: <LogOut size={18} />,
      action: handleLogout,
      danger: true,
    });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button (username below avatar) */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex flex-col items-center cursor-pointer select-none"
      >
        <img
          src={
            userInfo?.user?.profilePictureUrl ||
            `https://api.dicebear.com/8.x/thumbs/svg?seed=${username || "User"}`
          }
          alt="profile"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm hover:scale-105 transition-transform duration-200"
        />
        <span className="text-xs sm:text-sm mt-1 font-medium text-slate-800 dark:text-slate-200">
          {username}
        </span>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-lg ring-1 ring-black/5 p-2 z-50 backdrop-blur-sm"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  item.primary
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : item.danger
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
