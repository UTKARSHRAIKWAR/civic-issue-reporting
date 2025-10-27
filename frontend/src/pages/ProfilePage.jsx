import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PersonalInfoCard from "../components/PersonalInfoCard";
import SecurityCard from "../components/SecurityCard";
import ProfilePictureCard from "../components/ProfilePictureCard";
import ImpactCard from "../components/ImpactCard";
import api from "../axios";

const DEFAULT_AVATAR = "https://via.placeholder.com/96";

const ProfilePage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [currentUser, setCurrentUser] = useState(userInfo?.user || {});
  const _id = currentUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!_id) {
        return;
      }
      try {
        const response = await api.get(`/api/profile/${_id}`);
        const freshUserData = response.data;
        setCurrentUser(freshUserData);

        const updatedUserInfo = { ...userInfo, user: freshUserData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      } catch (error) {
        console.error("Could not get user data:", error);
        toast.error("Could not fetch latest profile data.");
      }
    };

    fetchUserData();
  }, [_id]);

  const updateUserData = (updatedUserFields) => {
    const updatedUser = { ...currentUser, ...updatedUserFields };
    const updatedUserInfo = { ...userInfo, user: updatedUser };

    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    setCurrentUser(updatedUser);
  };

  const handleProfileUpdate = (updatedUser) => {
    updateUserData(updatedUser);
    toast.success("Profile updated successfully!");
  };

  const handleProfilePicUpdate = (newPicUrl) => {
    updateUserData({ profilePictureUrl: newPicUrl });
    toast.success("Profile picture updated successfully!");
  };

  if (!_id) {
    return (
      <main className="flex flex-1 flex-col p-6 lg:p-10 items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          User not found. Please log in.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-10 min-h-screen">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 md:gap-8">
        <div className="mb-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-text-label dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-primary dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              My Profile
            </h1>
            <p className="text-text-label dark:text-gray-400 text-base font-normal leading-normal">
              View and edit your personal information and account settings.
            </p>
          </div>
        </div>

        <ImpactCard issuesReported={currentUser?.issueReported || 0} />

        <ProfilePictureCard
          userId={_id}
          initialProfilePicUrl={
            currentUser?.profilePictureUrl || DEFAULT_AVATAR
          }
          onPicUpdate={handleProfilePicUpdate}
        />

        <PersonalInfoCard
          userId={_id}
          user={currentUser}
          onInfoUpdate={handleProfileUpdate}
        />

        <SecurityCard />
      </div>
    </main>
  );
};

export default ProfilePage;
