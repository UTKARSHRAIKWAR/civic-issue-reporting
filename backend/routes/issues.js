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

router.patch(
  // update issue status
  "/:id/status",
  issueController.updateIssueStatus
);

// GET: All issues
router.get("/", issueController.getAllIssues);
router.get("/stats", issueController.getStats);
router.get("/:id", issueController.getIssueById);
router.delete("/:id", issueController.deleteIssue);
router.patch("/:id", issueController.updateIssue);

module.exports = router;
