import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import fileUpload from "express-fileupload";
// import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@sanity/client";

import authRouter from "./auth/auth.router.js";
import songRouter from "./song/song.router.js";
import playlistRouter from "./playlist/playlist.router.js";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN,
});

const PORT = parseInt(process.env.PORT) || 5000;
const app = express();
const server = createServer(app);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "uploads",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeader: true,
  })
);
app.use(express.json());

// app.use((_, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/api/v1/user", authRouter);
app.use("/api/v1/song", songRouter);
app.use("/api/v1/playlist", playlistRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Spotify API" });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
