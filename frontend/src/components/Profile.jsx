import React, { useState, useRef, useEffect } from "react";
import { LogIn, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const menuItems = token
    ? [
        {
          label: "Profile",
          icon: <User size={18} />,
          action: () => navigate("/profile"),
        },
        {
          label: "Settings",
          icon: <Settings size={18} />,
          action: () => navigate("/settings"),
        },
        {
          label: "Logout",
          icon: <LogOut size={18} />,
          action: handleLogout,
          danger: true,
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/70 backdrop-blur p-1.5 pr-3 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
      >
        <img
          src={
            user?.avatar || "https://api.dicebear.com/8.x/thumbs/svg?seed=User"
          }
          alt="profile"
          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
        />
        <span className="font-medium text-sm">Profile</span>
      </button>

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
