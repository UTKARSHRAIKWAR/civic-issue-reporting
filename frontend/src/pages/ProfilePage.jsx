import React, { useState, useEffect } from "react"; // 1. Import useEffect
import { toast } from "sonner";
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

  // 2. Fetch data inside a useEffect hook
  useEffect(() => {
    // Define an async function to fetch data
    const fetchUserData = async () => {
      if (!_id) {
        // Don't fetch if ID isn't available yet
        return;
      }

      try {
        // 3. Use "await" to get the response
        const response = await api.get(`/api/profile/${_id}`);

        // 4. Set the state with the fresh data from the server
        const freshUserData = response.data;
        setCurrentUser(freshUserData);

        // 5. Also update localStorage to keep it in sync
        const updatedUserInfo = { ...userInfo, user: freshUserData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      } catch (error) {
        console.error("Could not get user data:", error);
        toast.error("Could not fetch latest profile data.");
      }
    };

    fetchUserData(); // Call the fetch function
  }, [_id]); // This hook runs when the component mounts or if _id changes


  // This function updates state AND localStorage
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
      <main className="flex flex-1 flex-col p-6 lg:p-10 items-center justify-center">
        <p className="text-text-label">User not found. Please log in.</p>
      </main>
    );
  }

  return (
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

        {/* 6. This fix was correct (matches your schema) */}
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
