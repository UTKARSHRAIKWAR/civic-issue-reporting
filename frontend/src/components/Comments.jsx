import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../axios";
import { toast } from "sonner";

const socket = io(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  {
    withCredentials: true,
  }
);

const Comments = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const endOfCommentsRef = useRef(null);

  // ✅ Scroll to top (newest comment first)
  const scrollToTop = () => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ Join the issue room and listen for new comments
  useEffect(() => {
    if (!issueId) return;
    socket.emit("joinIssue", issueId);

    socket.on("newComment", (comment) => {
      setComments((prev) => [comment, ...prev]);
      scrollToTop();
    });

    return () => {
      socket.off("newComment");
    };
  }, [issueId]);

  // ✅ Fetch all existing comments when page loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const token = userInfo?.token;

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
  }, [issueId]);

  // ✅ Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo?.token;

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

  // ✅ Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // ✅ Helper: Avatar from initials
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

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
        ref={endOfCommentsRef}
        className="space-y-3 sm:space-y-4 mb-4 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow transition-all"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                {getInitials(comment.author?.username || "Anonymous")}
              </div>

              {/* Comment content */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                    {comment.author?.username || "Anonymous"}
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No comments yet — be the first to share your thoughts 💭
          </p>
        )}
      </div>

      {/* Add Comment Section */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
        <textarea
          rows={1}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... (Press Enter to send)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none"
        />
        <button
          onClick={handleAddComment}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Comments;
