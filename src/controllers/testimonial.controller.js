import Testimonial from "../models/Testimonial.js";

// Obtener solo testimonios aprobados (Para la Web Pública)
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.json({ ok: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// Obtener TODOS los testimonios (Para el Panel Admin)
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo testimonio (Público - Pendiente de aprobación)
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ ok: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// Actualizar estado (Aprobar/Rechazar - Solo Admin)
export const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!testimonial) {
      return res
        .status(404)
        .json({ ok: false, message: "Testimonio no encontrado" });
    }

    res.json({ ok: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// Eliminar testimonio (Solo Admin)
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res
        .status(404)
        .json({ ok: false, message: "Testimonio no encontrado" });
    }
    res.json({ ok: true, message: "Testimonio eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
