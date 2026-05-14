import Request from "../models/Request.js";

// Obtener todas las solicitudes (Solo Admin)
export const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: requests });
  } catch (error) {
    next(error);
  }
};

// Crear solicitud (Público)
export const createRequest = async (req, res, next) => {
  try {
    const request = await Request.create(req.body);
    res.status(201).json({ ok: true, data: request });
  } catch (error) {
    next(error);
  }
};
