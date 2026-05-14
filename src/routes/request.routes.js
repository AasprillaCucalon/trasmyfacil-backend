import { Router } from "express";
import {
  getRequests,
  createRequest,
} from "../controllers/request.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// Ruta Pública: Los clientes envían el formulario
router.post("/", createRequest);

// Ruta Privada: Solo el administrador ve los datos de contacto
router.get("/", adminAuth, getRequests);

export default router;
