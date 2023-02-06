import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import userRouter from "./auth/auth.router.js";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 5000;
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome To Spotify API" });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
