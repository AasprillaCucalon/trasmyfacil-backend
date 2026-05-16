import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import testimonialRoutes from "./routes/testimonial.routes.js";
import requestRoutes from "./routes/request.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import postRoutes from "./routes/post.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { getRssFeed } from "./controllers/rss.controller.js";

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-key"],
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "API TrasmyFácil funcionando",
  });
});

app.use("/api/testimonials", testimonialRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/rss.xml", getRssFeed);

app.use(errorHandler);

export default app;
