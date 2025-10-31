const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issues");
const { verifyToken, isAdmin } = require("../middlewares/validate");
const { upload } = require("../middlewares/multer.middleware");

router.post(
  // post issue
  "/",
  verifyToken, // verifyToken,
  upload.single("file"),
  issueController.createIssue
);

// GET: All issues
router.get("/", issueController.getAllIssues);

//admin routes
router.get("/stats", verifyToken, isAdmin, issueController.getStats);
router.get("/:id", verifyToken, isAdmin, issueController.getIssueById);
router.delete("/:id", verifyToken, isAdmin, issueController.deleteIssue);
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  issueController.updateIssueStatus //update issue status
);
//later update
router.patch("/:id", issueController.updateIssue);

module.exports = router;
