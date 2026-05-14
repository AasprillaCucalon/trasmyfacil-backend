import cloudinary from "../config/cloudinary.js";

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "No se recibió ningún archivo.",
      });
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "trasmyfacil/posts",
    });

    res.json({
      ok: true,
      data: {
        url: result.secure_url,
        type: result.resource_type,
      },
    });
  } catch (error) {
    console.error("Error Cloudinary:", error);

    res.status(500).json({
      ok: false,
      message: error.message || "Error subiendo archivo a Cloudinary.",
    });
  }
};
