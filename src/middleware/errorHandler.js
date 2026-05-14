export const errorHandler = (error, req, res, next) => {
  console.error("❌ Error:", error.message);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);

    return res.status(400).json({
      ok: false,
      message: "Error de validación.",
      errors: messages,
    });
  }

  res.status(500).json({
    ok: false,
    message: "Error interno del servidor.",
  });
};
