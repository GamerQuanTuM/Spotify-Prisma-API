import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./auth/auth.router.js";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const PORT = parseInt(process.env.PORT) || 5000;
const app = express();
const server = createServer(app);

app.use(fileUpload({ useTempFiles: true,tempFileDir:"uploads" }));
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Spotify API" });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
