import { PrismaClient } from "@prisma/client";
import { sanity } from "../index.js";
import fs from "fs";

const prisma = new PrismaClient({ log: ["query"] });

export const getPlaylist = async (req, res) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id },
      include: {
        songs: {
          select: {
            id: true,
            title: true,
            artist: true,
            album: true,
            songUrl: true,
          },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        songs: {
          select: {
            id: true,
            title: true,
            artist: true,
            album: true,
            songUrl: true,
          },
        },
      },
    });
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving playlists" });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, userId, isAdmin } = req.body;

    // Check if image was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Get image file
    const imageFile = req.files.image;

    // Generate unique filename for image
    const imageFilename = `${Date.now()}-${imageFile.name}`;

    // Upload image to Sanity
    const imageAsset = await sanity.assets.upload(
      "image",
      fs.createReadStream(imageFile.tempFilePath),
      {
        filename: imageFilename,
      }
    );

    fs.unlinkSync(imageFile.tempFilePath);

    console.log(imageAsset.url);
    // Construct playlist data with image URL
    const playlistData = {
      title,
      description,
      userId,
      image: imageAsset.url,
      isAdmin: isAdmin || false,
    };

    // Save playlist to PostgreSQL
    const playlist = await prisma.playlist.create({
      data: playlistData,
      select: {
        id: true,
        title: true,
        description: true,
        userId: true,
        image: true,
        isAdmin: true,
      },
    });

    return res.status(201).json(playlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating playlist" });
  }
};
