const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
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
});

module.exports = mongoose.model("Issue", issueSchema);
