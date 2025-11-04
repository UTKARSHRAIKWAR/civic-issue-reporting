import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

const socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  {
    withCredentials: true,
  }
);

const Comments = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const commentsRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const currentUserId = userInfo?.user?.id || userInfo?.user?._id;

  // Scroll to top when new comment arrives
  const scrollToTop = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Socket.io listeners
  useEffect(() => {
    if (!issueId) return;
    socket.emit("joinIssue", issueId);

    socket.on("newComment", (comment) => {
      setComments((prev) => [comment, ...prev]);
      scrollToTop();
    });

    socket.on("deleteComment", (commentId) => {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    });

    return () => {
      socket.off("newComment");
      socket.off("deleteComment");
    };
  }, [issueId]);

  // Fetch all comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await api.get(`/api/issues/${issueId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [issueId, token]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      await api.post(
        `/api/issues/${issueId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/issues/${issueId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // Handle Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  console.log();

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 sm:p-6 shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[#111318] dark:text-white flex items-center gap-2">
          💬 Comments
        </h2>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {comments.length} total
        </span>
      </div>

      {/* Comments List */}
      <div
        ref={commentsRef}
        className="space-y-3 sm:space-y-4 mb-4 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((comment) => {
              const username = comment.author?.username || "Anonymous";
              const canDelete =
                comment.author?._id === currentUserId ||
                userInfo?.user?.role === "admin";

              return (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Avatar */}
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      username
                    )}&backgroundColor=2563EB,0EA5E9,22C55E,F59E0B,EC4899`}
                    alt={username}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
                  />

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                          {username}
                        </span>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition p-1 rounded-md"
                          title="Delete Comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words">
                      {comment.text}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-sm text-center py-4"
            >
              No comments yet — be the first to share your thoughts 💭
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Add Comment Input */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
        <textarea
          rows={1}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... (Press Enter to send)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleAddComment}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default Comments;
