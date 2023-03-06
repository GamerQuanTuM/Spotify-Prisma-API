import { PrismaClient } from "@prisma/client";
import { sanity } from "../index.js";

const prisma = new PrismaClient({ log: ["query"] });

export const getSong = async (req, res) => {
  try {
    const song = await prisma.song.findUnique({
      where: { id: req.params.id },
      include: {
        playlists: {
          select: {
            id: true,
            description: true,
            image: true,
            isAdmin: true,
            title: true,
            userId: true,
          },
        },
        likedBy: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const createSong = async (req, res) => {
  try {
    const { title, artist, album } = req.body;
    const file = req.files.song;

    // Save file to Sanity
    const result = await sanity.assets.upload("file", file.data, {
      contentType: file.mimetype,
    });
    const songUrl = result.url;

    // Save song to database
    const song = await prisma.song.create({
      data: {
        title,
        artist,
        album,
        songUrl,
      },
      select:{
        id:true,
        title:true,
        artist:true,
        album:true,
        songUrl:true,
        
      }
    });

    res.status(200).json(song);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
