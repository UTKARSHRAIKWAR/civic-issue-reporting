import { toast } from "sonner";
import api from "../axios";
import { useEffect, useRef, useState } from "react";

const ProfilePictureCard = ({ userId, initialProfilePicUrl, onPicUpdate }) => {
  const [profilePic, setProfilePic] = useState(initialProfilePicUrl);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Update profile pic if the prop changes (e.g., parent state updates)
  useEffect(() => {
    setProfilePic(initialProfilePicUrl);
  }, [initialProfilePicUrl]);

  const handleSelectImage = () => {
    if (isUploading) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleCancelUpload = () => {
    setProfilePic(initialProfilePicUrl); // Revert to original
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error("No new picture selected.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await api.post(
        `/api/profile/${userId}/profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const newPicUrl = response.data.profilePictureUrl;
        onPicUpdate(newPicUrl); // Tell the parent component!
        setSelectedFile(null); // Clear selection
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture.");
      setProfilePic(initialProfilePicUrl); // Revert on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
              src={profilePic}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {!selectedFile ? (
              <button
                onClick={handleSelectImage}
                disabled={isUploading}
                className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium leading-normal text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <span className="truncate">Change Picture</span>
              </button>
            ) : (
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
                  onClick={handleCancelUpload}
                  disabled={isUploading}
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-transparent px-4 text-sm font-medium leading-normal text-primary transition-colors hover:bg-primary/5 dark:border-gray-600 dark:text-white dark:hover:bg-primary/20 disabled:opacity-50"
                >
                  <span className="truncate">Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePictureCard;
