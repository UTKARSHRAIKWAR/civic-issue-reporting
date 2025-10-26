import { toast } from "sonner";
import api from "../axios";
import { useEffect, useState } from "react";

const PersonalInfoCard = ({ userId, user, onInfoUpdate }) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    city: user.city || "",
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
    });
  }, [user]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setIsEditingInfo(true);
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
    });
  };

  const handleInfoSave = async () => {
    setIsSavingInfo(true);
    try {
      const response = await api.put(`/api/profile/${userId}`, {
        name: formData.name,
        email: formData.email,
        city: formData.city,
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        onInfoUpdate(updatedUser);
        setIsEditingInfo(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.error);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile."
        );
      }
    } finally {
      setIsSavingInfo(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-transparent bg-white p-6 shadow-sm @container dark:bg-background-dark dark:border-gray-700">
      <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <p className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Personal Information
            </p>
            <p className="text-text-label text-base font-normal leading-normal">
              Update your name, email, and city.
            </p>
          </div>

          {isEditingInfo ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isSavingInfo}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-gray-300 dark:border-gray-600 bg-transparent text-primary dark:text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/5 dark:hover:bg-primary/20 disabled:opacity-50"
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                onClick={handleInfoSave}
                disabled={isSavingInfo}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-medium leading-normal transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                <span className="truncate">
                  {isSavingInfo ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal transition-colors hover:bg-primary/90"
            >
              <span className="truncate">Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 @lg:grid-cols-2">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-text-label text-sm font-medium leading-normal pb-2">
            User Name
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal disabled:opacity-70"
            readOnly={!isEditingInfo}
            disabled={!isEditingInfo}
            value={formData.name}
            onChange={handleInfoChange}
            name="name"
          />
        </label>
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-text-label text-sm font-medium leading-normal pb-2">
            Email Address
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal disabled:opacity-70"
            readOnly={!isEditingInfo}
            disabled={!isEditingInfo}
            value={formData.email}
            onChange={handleInfoChange}
            name="email"
            type="email"
          />
        </label>
        <label className="flex flex-col min-w-40 flex-1 @lg:col-span-2">
          <p className="text-text-label text-sm font-medium leading-normal pb-2">
            City
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-body bg-gray-100 focus:outline-0 focus:ring-2 focus:ring-secondary/50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-secondary h-12 placeholder:text-text-label p-3 text-base font-normal leading-normal disabled:opacity-70"
            readOnly={!isEditingInfo}
            disabled={!isEditingInfo}
            value={formData.city}
            onChange={handleInfoChange}
            name="city"
            type="text"
            placeholder="e.g. New York"
          />
        </label>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
