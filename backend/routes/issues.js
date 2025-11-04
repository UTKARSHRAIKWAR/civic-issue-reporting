const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issues");
const { verifyToken, isAdmin } = require("../middlewares/validate");
const { upload } = require("../middlewares/multer.middleware");

router.post(
  // post issue
  "/",
  verifyToken,
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

//comment
router.post("/:id/comments", verifyToken, issueController.addComment);
router.get("/:id/comments", verifyToken, issueController.getComment);
router.delete(
  "/:issueId/comments/:commentId",
  verifyToken,
  issueController.deleteComment
);

module.exports = router;
