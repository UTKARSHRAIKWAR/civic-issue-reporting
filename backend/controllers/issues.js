const Issue = require("../models/issues");
const sendEmail = require("../utils/sendEmail");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const mongoose = require("mongoose");
const User = require("../models/userModel.js");

const createIssue = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      error: "User not authenticated. Please log in to report an issue.",
    });
  }
  const {
    title,
    category,
    description,
    location,
    phone,
    email,
    notifyByEmail,
  } = req.body;

  let locationObj = {};
  try {
    locationObj = JSON.parse(location);
  } catch (err) {
    locationObj = { name: "Unknown", latitude: null, longitude: null };
  }

  if (!title || !category || !description) {
    return res
      .status(400)
      .json({ error: "Title, description, and category are required" });
  }

  let fileUrl = null;

  if (req.file) {
    // console.log(req.file);
    const localFilePath = req.file?.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    // console.log(cloudinaryResponse);

    if (cloudinaryResponse) {
      fileUrl = cloudinaryResponse.secure_url;
    } else {
      return res
        .status(500)
        .json({ error: "Failed to upload file to Cloudinary" });
    }
  }

  const issue = await Issue.create({
    title,
    category,
    description,
    location: locationObj,
    phone,
    email,
    notifyByEmail: notifyByEmail === "true",
    fileUrl,
    reportedBy: userId,
  });

  if (issue) {
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { issueReported: 1 }, // Atomically increment the count by 1
      });
    } catch (userUpdateError) {
      console.error(
        `Failed to update issue count for user ${userId}:`,
        userUpdateError
      );
    }
  }

  return res
    .status(201)
    .json({ message: "Issue submitted successfully", issue });
});

const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 });
  return res.json(issues);
});

const updateIssueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  issue.status = newStatus;
  await issue.save();

  if (issue.notifyByEmail && issue.email) {
    await sendEmail(
      issue.email,
      "Civix - Issue Status Update",
      `<p>Your issue <strong>${issue.title}</strong> is now <strong>${newStatus}</strong>.</p>`
    );
  }

  return res.json({ message: "Status updated successfully." });
});

const getIssueById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Optional: Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid issue ID format" });
  }

  const issue = await Issue.findById(id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  return res.json(issue);
});

const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid issue ID format" });
  }

  const issue = await Issue.findByIdAndDelete(id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  return res.json({ message: "Issue deleted successfully", issue });
});

const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid issue ID format" });
  }

  const { title, description, phone, email, notifyByEmail } = req.body;

  let fileUrl;
  if (req.file) {
    const localFilePath = req.file?.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (cloudinaryResponse) {
      fileUrl = cloudinaryResponse.secure_url;
    } else {
      return res
        .status(500)
        .json({ error: "Failed to upload file to Cloudinary" });
    }
  }

  const updatedIssue = await Issue.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(description && { description }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(notifyByEmail !== undefined && {
        notifyByEmail: notifyByEmail === "true",
      }),
      ...(fileUrl && { fileUrl }),
    },
    { new: true }
  );

  if (!updatedIssue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  // 🔔 Send email if notifyByEmail is true and email exists
  if (updatedIssue.notifyByEmail && updatedIssue.email) {
    await sendEmail(
      updatedIssue.email,
      "Civix - Issue Updated",
      `<p>Your issue <strong>${updatedIssue.title}</strong> has been updated successfully.</p>
       <p>You can check the latest details in the system.</p>`
    );
  }

  return res.json({
    message: "Issue updated successfully",
    issue: updatedIssue,
  });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await Issue.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Initialize counts
  let total = 0,
    pending = 0,
    open = 0,
    inProgress = 0,
    resolved = 0;

  stats.forEach((item) => {
    total += item.count; // total of all issues
    if (item._id === "Pending") pending = item.count;
    else if (item._id === "Open") open = item.count;
    else if (item._id === "InProgress") inProgress = item.count;
    else if (item._id === "Resolved") resolved = item.count;
  });

  res.status(200).json({ total, pending, open, inProgress, resolved });
});

module.exports = {
  createIssue,
  getAllIssues,
  updateIssueStatus,
  getIssueById,
  deleteIssue,
  updateIssue,
  getStats,
};
