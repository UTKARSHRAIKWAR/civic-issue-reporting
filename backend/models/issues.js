const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String, required: true },
  location: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  phone: String,
  email: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Open", "Resolved", "InProgress"],
    default: "Pending",
  },
  notifyByEmail: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
  reportedBy: { type: String },
  comments: [CommentSchema],
});

module.exports = mongoose.model("Issue", issueSchema);
