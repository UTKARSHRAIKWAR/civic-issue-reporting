import React, { useState } from "react";
import api from "../axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation before sending request
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // ✅ If success
      toast.success(response.data?.message || "Account created successfully!");
      navigate("/login");
    } catch (error) {
      // ✅ Smart error handling
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          toast.error(
            "This email or username is already registered. Try logging in."
          );
        } else if (status === 400 && data?.error) {
          toast.error(data.error);
        } else {
          toast.error(data?.error || "Signup failed. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-indigo-600 text-4xl sm:text-3xl">
          how_to_vote
        </span>
        <h1 className="text-3xl sm:text-2xl font-semibold text-gray-900">
          Civic Connect
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-xl font-semibold text-center text-gray-900">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Sign up to start reporting civic issues.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              className="mt-1 w-full h-11 sm:h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full h-11 sm:h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formData.email && (
              <p
                className={`text-sm mt-1 ${
                  formData.email.endsWith("@civicconnect.in")
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {formData.email.endsWith("@civicconnect.in")
                  ? "You are registering as an admin."
                  : "You are registering as a normal user."}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 w-full h-11 sm:h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-indigo-600 font-medium"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="mt-1 w-full h-11 sm:h-10 rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium h-11 sm:h-10 rounded-md hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-500">
        © 2025 Civic Connect. All rights reserved.
        <div className="flex justify-center gap-2 mt-1 flex-wrap">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
