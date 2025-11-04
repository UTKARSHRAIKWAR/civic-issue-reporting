const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  uploadProfilePicture,
  getUserById,
} = require("../controllers/profileControllers.js");
const upload = require("../middlewares/upload");

// Get user profile by  ID
router.get("/:_id", getUserById);

// Update user profile
router.put("/:_id", updateUserProfile);

// // Create or update user profile (for Clerk integration)
// router.post("/create-or-update", createOrUpdateUserProfile);

// Upload optional profile picture
router.post(
  "/:_id/profile-picture",
  upload.single("image"),
  uploadProfilePicture
);

module.exports = router;
