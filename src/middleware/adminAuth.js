export const adminAuth = (req, res, next) => {
  const apiKey = req.headers["x-admin-key"];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      ok: false,
      message: "No autorizado.",
    });
  }

  next();
};
