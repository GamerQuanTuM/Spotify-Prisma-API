import express from "express";
import {
  createPlaylist,
  getPlaylist,
  getPlaylists,
} from "./playlist.controller.js";

const router = express.Router();

router.get("/:id", getPlaylist);
router.get("/", getPlaylists);
router.post("/", createPlaylist);

export default router;
