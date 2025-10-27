const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // could be 'admin' or 'user'
    city: { type: String, default: null },
    profilePictureUrl: { type: String, default: null },
    issueReported: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Method to check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return this.username && this.email && this.city;
};

// Static method to find user by ID
userSchema.statics.getUserById = function (_id) {
  return this.findOne({ _id });
};

module.exports = mongoose.model("User", userSchema);
