import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { initCron } from "./utils/cron.js"; // Importamos el iniciador

const PORT = process.env.PORT || 4000;

// Conectar DB e iniciar servicios
connectDB().then(() => {
  initCron(); // Iniciamos el cron después de confirmar la conexión a DB
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en http://localhost:${PORT}`);
});
