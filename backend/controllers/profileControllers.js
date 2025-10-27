const User = require("../models/userModel.js");
const xss = require("xss");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

// Get user profile by ID
const getUserById = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    city: user.city,
    profilePictureUrl: user.profilePictureUrl || null,
    isProfileComplete: user.isProfileComplete(),
    issueReported: user.issueReported,
  });
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const { username, email, city } = req.body;

  // Validate required fields
  if (!username || !email || !city) {
    return res.status(400).json({
      error: "Name, email, and city are required",
    });
  }

  // Sanitize inputs
  const sanitizedName = xss(username);
  const sanitizedEmail = xss(email);
  const sanitizedLocation = xss(city);

  // Check if email is already taken by another user
  const existingUser = await User.findOne({
    email: sanitizedEmail,
    _id: { $ne: _id },
  });

  if (existingUser) {
    return res
      .status(409)
      .json({ error: "Email already taken by another user" });
  }

  // Find and update user
  const user = await User.findOneAndUpdate(
    { _id },
    {
      username: sanitizedName,
      email: sanitizedEmail,
      city: sanitizedLocation,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(44).json({ error: "User not found" });
  }

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    city: user.city,
    profilePictureUrl: user.profilePictureUrl || null,
    isProfileComplete: user.isProfileComplete(),
    message: "Profile updated successfully",
  });
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const localFilePath = req.file.path;
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

  if (!cloudinaryResponse) {
    return res.status(500).json({ error: "Failed to upload image" });
  }

  const imageUrl = cloudinaryResponse.secure_url;

  const user = await User.findOneAndUpdate(
    { _id },
    { profilePictureUrl: imageUrl },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ profilePictureUrl: imageUrl });
});

module.exports = {
  getUserById,
  updateUserProfile,
  // Upload and set user's profile picture
  uploadProfilePicture,
};
