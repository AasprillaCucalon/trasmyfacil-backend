import { Router } from "express";
import {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonial.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// Rutas Públicas
router.get("/", getTestimonials); // Para la web principal
router.post("/", createTestimonial); // Para que los clientes envíen su testimonio

// Rutas Privadas (Protegidas por adminAuth)
router.get("/admin", adminAuth, getAdminTestimonials);
router.patch("/:id/status", adminAuth, updateTestimonialStatus);
router.delete("/:id", adminAuth, deleteTestimonial);

export default router;
