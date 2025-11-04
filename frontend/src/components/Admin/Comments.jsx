// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import api from "../../axios";
// import { toast } from "sonner";

// const socket = io(
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
//   {
//     withCredentials: true,
//   }
// );

// const Comments = ({ issueId, userId }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   // ✅ Join the issue room and listen for new comments
//   useEffect(() => {
//     if (!issueId) return;
//     socket.emit("joinIssue", issueId);

//     socket.on("newComment", (comment) => {
//       setComments((prev) => [...prev, comment]);
//     });

//     return () => {
//       socket.off("newComment");
//     };
//   }, [issueId]);

//   // ✅ Fetch all existing comments when page loads
//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//         const token = userInfo?.token;

//         const { data } = await api.get(`/api/issues/${issueId}/comments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setComments(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchComments();
//   }, [issueId]);

//   // ✅ Add a new comment
//   const handleAddComment = async () => {
//     if (!newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     try {
//       const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//       const token = userInfo?.token;

//       await api.post(
//         `/api/issues/${issueId}/comments`,
//         { text: newComment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setNewComment("");
//       // No need to update state manually — socket will push it
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add comment");
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
//       <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
//         Comments
//       </h2>

//       <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
//         {comments.length > 0 ? (
//           comments.map((comment, idx) => (
//             <div
//               key={idx}
//               className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
//             >
//               <p className="text-sm text-gray-800 dark:text-gray-300">
//                 {comment.text}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {comment.author?.username || "Anonymous"} •{" "}
//                 {new Date(comment.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-sm">No comments yet.</p>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//           className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
//         />
//         <button
//           onClick={handleAddComment}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Comments;

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../../axios";
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

  // ✅ Join the issue room and listen for new comments
  useEffect(() => {
    if (!issueId) return;
    socket.emit("joinIssue", issueId);

    socket.on("newComment", (comment) => {
      // 🆕 Add new comment at the top instead of bottom
      setComments((prev) => [comment, ...prev]);
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

        // 🆕 Sort by newest first
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
      // No need to update manually — socket handles it
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#111318] dark:text-white mb-4">
        Comments
      </h2>

      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <p className="text-sm text-gray-800 dark:text-gray-300">
                {comment.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {comment.author?.username || "Anonymous"} •{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Comments;
