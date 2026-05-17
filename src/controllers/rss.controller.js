import RSS from "rss";
import Post from "../models/Post.js";

export const getPostForSocial = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Publicación no encontrada");

    const backendUrl = `${req.protocol}://${req.get("host")}`;
    const frontendUrl =
      process.env.CLIENT_URL || "https://trasmyfacil.netlify.app";
    const defaultImageUrl =
      "https://trasmyfacil.netlify.app/assets/logo_web.png";

    let imageUrl = defaultImageUrl;
    let videoUrl = "";
    let videoType = "text/html"; // por defecto para embebidos

    if (post.mediaUrl) {
      const mediaUrl = post.mediaUrl;

      // Detectar tipo de multimedia
      if (post.mediaType === "image") {
        imageUrl = mediaUrl.startsWith("http")
          ? mediaUrl
          : backendUrl + mediaUrl;
      } else if (post.mediaType === "video" || post.mediaType === "reel") {
        videoUrl = mediaUrl;

        // YouTube
        // YouTube (ampliado para soportar /embed/ y /shorts/)
        if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
          let videoId = "";
          // Formato estándar: youtube.com/watch?v=...
          if (mediaUrl.includes("youtube.com/watch?v=")) {
            videoId = mediaUrl.split("v=")[1]?.split("&")[0];
          }
          // Formato acortado: youtu.be/...
          else if (mediaUrl.includes("youtu.be/")) {
            videoId = mediaUrl.split("youtu.be/")[1]?.split("?")[0];
          }
          // NUEVO: Formato embed: youtube.com/embed/...
          else if (mediaUrl.includes("youtube.com/embed/")) {
            videoId = mediaUrl.split("/embed/")[1]?.split("?")[0];
          }
          // NUEVO: Formato Shorts: youtube.com/shorts/...
          else if (mediaUrl.includes("youtube.com/shorts/")) {
            videoId = mediaUrl.split("/shorts/")[1]?.split("?")[0];
          }

          if (videoId) {
            // Asigna la URL de la miniatura de máxima calidad
            imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            videoType = "text/html";
          }
        }
        // Cloudinary video
        else if (mediaUrl.includes("cloudinary.com")) {
          // Convertir URL de video a imagen (jpg)
          imageUrl = mediaUrl.replace(/\.[^/.]+$/, ".jpg");
          videoType = "video/mp4";
        }
        // Otras plataformas (TikTok, Instagram, Vimeo) usan imagen por defecto
        // y el video se compartirá como enlace (Facebook mostrará su propia vista previa)
      }
    }

    res.render("post", {
      post,
      backendUrl,
      frontendUrl,
      imageUrl,
      videoUrl,
      videoType,
    });
  } catch (error) {
    next(error);
  }
};

export const getRssFeed = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "published" })
      .sort({ publishAt: -1 })
      .limit(20);

    // URL del backend (donde están los metadatos Open Graph)
    const backendUrl =
      process.env.BACKEND_URL || "https://trasmyfacil-backend.onrender.com";
    // URL del frontend (para el logo)
    const frontendUrl =
      process.env.PUBLIC_SITE_URL || "https://trasmyfacil.netlify.app";

    const feed = new RSS({
      title: "TrasmyFácil - Noticias y novedades",
      description:
        "Información actualizada sobre trámites administrativos, citas, SEPE, Extranjería, Seguridad Social y más.",
      feed_url: `${backendUrl}/rss.xml`,
      site_url: backendUrl,
      image_url: `${frontendUrl}/assets/logo_web.png`,
      language: "es",
      copyright: `TrasmyFácil ${new Date().getFullYear()}`,
      pubDate: new Date(),
    });

    posts.forEach((post) => {
      const postUrl = `${backendUrl}/informacion/${post._id}`;

      const item = {
        title: post.title,
        description:
          post.content.substring(0, 300) +
          (post.content.length > 300 ? "..." : ""),
        url: postUrl,
        guid: post._id,
        date: post.publishAt,
        categories: [post.category],
      };

      if (post.mediaUrl && post.mediaType === "image") {
        item.enclosure = {
          url: post.mediaUrl,
          type: "image/jpeg",
        };
        item.custom_elements = [
          {
            "media:content": {
              _attr: { url: post.mediaUrl, medium: "image" },
            },
          },
        ];
      }

      feed.item(item);
    });

    res.set("Content-Type", "application/rss+xml");
    res.send(feed.xml({ indent: true }));
  } catch (error) {
    next(error);
  }
};
