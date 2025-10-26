import React, { useState } from "react";
import { toast } from "sonner";
import PersonalInfoCard from "../components/PersonalInfoCard";
import SecurityCard from "../components/SecurityCard";
import ProfilePictureCard from "../components/ProfilePictureCard";
import ImpactCard from "../components/ImpactCard";

const DEFAULT_AVATAR = "https://via.placeholder.com/96";

const ProfilePage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [currentUser, setCurrentUser] = useState(userInfo?.user || {});
  const _id = currentUser?.id;

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

        <ImpactCard issuesReported={currentUser?.issuesReported || 28} />

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
