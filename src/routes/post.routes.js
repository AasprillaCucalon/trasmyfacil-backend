import { Router } from "express";
import {
  createPost,
  deletePost,
  getAdminPosts,
  getPublicPostById,
  getPublicPosts,
  updatePost,
  updatePostStatus,
} from "../controllers/post.controller.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// Pública: publicaciones visibles en Información
router.get("/", getPublicPosts);

// Privada: admin ve todas las publicaciones
router.get("/admin", adminAuth, getAdminPosts);

// Pública: ver una publicación individual
router.get("/:id", getPublicPostById);

// Privada: admin crea publicaciones
router.post("/", adminAuth, createPost);

// Privada: admin edita publicaciones
router.patch("/:id", adminAuth, updatePost);

// Privada: admin cambia estado
router.patch("/:id/status", adminAuth, updatePostStatus);

// Privada: admin elimina publicaciones
router.delete("/:id", adminAuth, deletePost);

export default router;
