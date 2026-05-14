import { Router } from "express";

import { uploadMedia } from "../controllers/upload.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", adminAuth, upload.single("media"), uploadMedia);

export default router;
