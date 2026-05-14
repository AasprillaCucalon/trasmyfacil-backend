import cron from "node-cron";
import Post from "../models/Post.js"; // Verifica que esta ruta llegue a tu modelo

export const initCron = () => {
  // Se ejecuta cada minuto para revisar publicaciones programadas
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      // Buscamos posts programados cuya fecha ya pasó
      const postsToPublish = await Post.find({
        status: "scheduled",
        publishAt: { $lte: now },
      });

      if (postsToPublish.length > 0) {
        for (const post of postsToPublish) {
          post.status = "published";
          await post.save();
          console.log(
            `✅ [CRON] Post publicado automáticamente: ${post.title}`,
          );
        }
      }
    } catch (error) {
      console.error("❌ [CRON] Error en la automatización:", error);
    }
  });

  console.log("⏰ Sistema de cron jobs inicializado");
};
