import RSS from "rss";
import Post from "../models/Post.js";

export const getRssFeed = async (req, res, next) => {
  try {
    // Obtener las últimas 20 publicaciones publicadas
    const posts = await Post.find({ status: "published" })
      .sort({ publishAt: -1 })
      .limit(20);

    const siteUrl =
      process.env.PUBLIC_SITE_URL || "https://trasmyfacil.netlify.app";

    const feed = new RSS({
      title: "TrasmyFácil - Noticias y novedades",
      description:
        "Información actualizada sobre trámites administrativos, citas, SEPE, Extranjería, Seguridad Social y más.",
      feed_url: `${siteUrl}/rss.xml`,
      site_url: siteUrl,
      image_url: `${siteUrl}/assets/logo_web.png`,
      language: "es",
      copyright: `TrasmyFácil ${new Date().getFullYear()}`,
      pubDate: new Date(),
    });

    posts.forEach((post) => {
      const postUrl = `${siteUrl}/informacion/${post._id}`;
      feed.item({
        title: post.title,
        description:
          post.content.substring(0, 300) +
          (post.content.length > 300 ? "..." : ""),
        url: postUrl,
        guid: post._id,
        date: post.publishAt,
        categories: [post.category],
      });
    });

    res.set("Content-Type", "application/rss+xml");
    res.send(feed.xml());
  } catch (error) {
    next(error);
  }
};
