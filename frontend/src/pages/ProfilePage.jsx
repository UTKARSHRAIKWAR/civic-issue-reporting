import React, { useRef, useState } from "react";
import api from "../axios"; // Assuming your axios instance is here
import { toast } from "sonner"; // Assuming you use sonner for toasts

// Using a default placeholder image, as the one in the HTML is not accessible
const DEFAULT_AVATAR = "https://via.placeholder.com/150";

const ProfilePage = ({ user }) => {
  // State from your original component
  const [profilePic, setProfilePic] = useState(
    user?.profilePic || DEFAULT_AVATAR
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Profile Picture Logic from your original component ---

  // Trigger file selection
  const handleSelectImage = () => {
    if (isUploading) return;
    fileInputRef.current.click();
  };

  // Preview selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle removing/canceling the picture
  const handleRemovePicture = () => {
    setProfilePic(user?.profilePic || DEFAULT_AVATAR);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  // Upload to backend
  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("No new picture selected.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePic", selectedFile);

      // API call from your original component
      const response = await api.post("/user/update-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Profile picture updated successfully!");
        // Assuming response.data.profilePicUrl holds the new permanent URL
        const newPicUrl = response.data.profilePicUrl;
        setProfilePic(newPicUrl); // Set the new URL from the server
        setSelectedFile(null); // Clear selection
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture.");
      // Revert to original picture on failure
      setProfilePic(user?.profilePic || DEFAULT_AVATAR);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Render JSX based on the new HTML design ---
  return (
    // Note: The parent container styling (bg-background-light, dark:bg-background-dark)
    // is assumed to be in a layout file or tailwind.config.js.
    // This component renders the <main> content.
    <main className="flex flex-1 flex-col p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-primary dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              My Profile
            </h1>
            <p className="text-text-label text-base font-normal leading-normal">
              View and edit your personal information and account settings.
            </p>
          </div>
        </div>

        {/* Your Impact Card */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-transparent bg-white p-6 shadow-sm dark:bg-background-dark dark:border-gray-700">
            <p className="text-text-label text-base font-medium leading-normal">
              Your Impact
            </p>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent/20">
                <span className="material-symbols-outlined text-accent text-3xl">
                  flag
                </span>
              </div>
              <div>
                <p className="text-primary dark:text-white tracking-light text-3xl font-bold leading-tight">
                  {user?.issuesReported || 28}
                </p>
                <p className="text-text-body dark:text-gray-300 text-base font-medium leading-normal">
                  Total Issues Reported
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Card */}
        <div className="flex flex-col rounded-xl border border-transparent bg-white p-6 shadow-sm @container dark:bg-background-dark dark:border-gray-700">
          <div className="flex w-full flex-col items-stretch justify-center gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col">
                <p className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Profile Picture
                </p>
                <p className="text-text-label text-base font-normal leading-normal">
                  Update your profile picture.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <img
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                  src={profilePic} // Use state variable
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <button
                  onClick={handleSelectImage}
                  disabled={isUploading}
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium leading-normal text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <span className="truncate">Change Picture</span>
                </button>

                {/* Conditionally show Save/Cancel or Remove */}
                {selectedFile ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isUploading}
                      className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-green-600 px-4 text-sm font-medium leading-normal text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      <span className="truncate">
                        {isUploading ? "Saving..." : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={handleRemovePicture}
                      disabled={isUploading}
                      className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-transparent px-4 text-sm font-medium leading-normal text-primary transition-colors hover:bg-primary/5 dark:border-gray-600 dark:text-white dark:hover:bg-primary/20 disabled:opacity-50"
                    >
                      <span className="truncate">Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRemovePicture} // This will just reset to default if not saved
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-transparent px-4 text-sm font-medium leading-normal text-primary transition-colors hover:bg-primary/5 dark:border-gray-600 dark:text-white dark:hover:bg-primary/20"
                  >
                    <span className="truncate">Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Hidden file input from original component */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Personal Information Card */}
        <div className="flex flex-col rounded-xl border border-transparent bg-white p-6 shadow-sm @container dark:bg-background-dark dark:border-gray-700">
          <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <p className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Personal Information
                </p>
                <p className="text-text-label text-base font-normal leading-normal">
                  Update your name and email address.
                </p>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90">
                <span className="truncate">Edit Profile</span>
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 @lg:grid-cols-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-label text-sm font-medium leading-normal pb-2">
                Full Name
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal"
                readOnly={true}
                value={user?.name || "John Doe"} // Use prop data
              />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-label text-sm font-medium leading-normal pb-2">
                Email Address
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal"
                readOnly={true}
                value={user?.email || "john.doe@email.com"} // Use prop data
              />
            </label>
          </div>
        </div>

        {/* Security Card */}
        <div className="flex flex-col rounded-xl border border-transparent bg-white p-6 shadow-sm @container dark:bg-background-dark dark:border-gray-700">
          <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <p className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  Security
                </p>
                <p className="text-text-label text-base font-normal leading-normal">
                  Manage your account password.
                </p>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-gray-300 dark:border-gray-600 bg-transparent text-primary dark:text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/5 dark:hover:bg-primary/20">
                <span className="truncate">Change Password</span>
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 @lg:grid-cols-2">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-text-label text-sm font-medium leading-normal pb-2">
                Password
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal"
                readOnly={true}
                type="password"
                value="••••••••••"
              />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
