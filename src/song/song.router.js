import express from "express";
import { createSong, getSong } from "./song.controller.js";

const router = express.Router();

router.get("/:id", getSong);
router.post("/", createSong);

export default router;
