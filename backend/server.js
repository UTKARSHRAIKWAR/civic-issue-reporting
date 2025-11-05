// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");
// const rateLimit = require("express-rate-limit");
// const path = require("path");
// require("dotenv").config();
// const { Server } = require("socket.io");

// // Security middlewares
// const { xssSanitizer } = require("./middlewares/xssSanitizer");
// const {
//   skipCSRFForRoutes,
//   csrfErrorHandler,
// } = require("./middlewares/csrfProtection");

// const app = express();

// // === Database Initialization ===

// // Commented db.js import so that the app can run on MongoDB only to rectify the issue of multiple database connections

// // require("./config/db.js");     // PostgreSQL
// require("./config/mongo.js"); // MongoDB

// // === Swagger Docs ===
// const { swaggerUi, specs } = require("./config/swagger.js");

// // === Middlewares ===
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://civic-issue-reporting-phi.vercel.app",
//       "https://civic-issue-reporting-phi.vercel.app/",
//     ],
//     credentials: true,
//   })
// );
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // === Security Middlewares ===
// // Global XSS Sanitization
// app.use(xssSanitizer);

// // CSRF Protection (skip for certain routes)
// const csrfSkipRoutes = [
//   "/api/contributors", // Public read-only API
//   "/api-docs", // Swagger documentation
//   "/api/auth/webhook", // Potential webhooks (if any)
// ];
// // app.use(skipCSRFForRoutes(csrfSkipRoutes));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // === Rate Limiting ===
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// // === Routes ===
// const authRoutes = require("./routes/auth.js");
// const issueRoutes = require("./routes/issues.js");
// const profileRoutes = require("./routes/profileRoutes.js");
// // const contributionsRoutes = require("./routes/contributions.js");

// // CSRF token endpoint
// // app.get("/api/csrf-token", (req, res) => {
// //   res.json({ csrfToken: req.csrfToken() });
// // });

// app.use("/api/auth", authRoutes);
// app.use("/api/issues", issueRoutes);
// app.use("/api/profile", profileRoutes);

// // === Swagger API Docs ===
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// // === Error Handlers ===
// // CSRF Error Handler (must come before global error handler)
// app.use(csrfErrorHandler);

// // Global Error Handler
// const errorHandler = require("./middlewares/errorHandler.js");
// app.use(errorHandler);

// // === Start Server ===
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const http = require("http"); // ✅ Needed for socket.io
const { Server } = require("socket.io");
require("dotenv").config();

// === Security Middlewares ===
const { xssSanitizer } = require("./middlewares/xssSanitizer");
const {
  skipCSRFForRoutes,
  csrfErrorHandler,
} = require("./middlewares/csrfProtection");

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

// === Database Initialization ===
require("./config/mongo.js"); // MongoDB

// === Swagger Docs ===
const { swaggerUi, specs } = require("./config/swagger.js");

// === Middlewares ===
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://civic-issue-reporting-phi.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xssSanitizer);

// === Static Uploads ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Rate Limiting ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// === Routes ===
const authRoutes = require("./routes/auth.js");
const issueRoutes = require("./routes/issues.js");
const profileRoutes = require("./routes/profileRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/profile", profileRoutes);

// === Swagger Docs ===
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); //api doc

// === Error Handlers ===
app.use(csrfErrorHandler);
const errorHandler = require("./middlewares/errorHandler.js");
app.use(errorHandler);

// === Socket.io Setup ===
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://civic-issue-reporting-phi.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

// === Socket.io Events ===
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join room for specific issue
  socket.on("joinIssue", (issueId) => {
    socket.join(issueId);
    console.log(`User joined issue room: ${issueId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Make Socket.io accessible in routes
app.set("io", io);

// === Start Server ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
