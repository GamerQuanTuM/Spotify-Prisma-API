import { PrismaClient, Gender } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  // create some users
  const users = await Promise.all([
    db.user.create({
      data: {
        name: "John Doe",
        email: "johndoeexample.com",
        password: "john@010",
        gender: Gender.MALE,
        // image: "Image",
        likedPlaylists: {
          create: [
            { title: "Johns favorite playlists", description: "Desc 1" },
            { title: "Johns second favorite playlists", description: "Desc 2" },
          ],
        },
        likedSongs: {
          create: [
            { title: "Johns favorite song", artist: "A", album: "A" },
            { title: "Johns second favorite song", artist: "B", album: "A" },
          ],
        },
      },
    }),
  ]);

  // create some songs
  const songs = await Promise.all([
    db.song.create({
      data: {
        title: "Song 1",
        artist: "Artist 1",
        album: "A",
        likedBy: {
          connect: [{ id: users[0].id }],
        },

      },
    }),
  ]);

  // create some playlists
  const playlists = await Promise.all([
    db.playlist.create({
      data: {
        title: "Playlist 1",
        description: "PlayList",
        songs: {
          connect: [{ id: songs[0].id }],
        },
        userId: users[0].id,
        image: "Image",
      },
    }),
  ]);

  console.log(`
    Created ${users.length} users:
    ${users.map((u) => u.name).join(", ")}

    Created ${songs.length} songs:
    ${songs.map((s) => s.title).join(", ")}

    Created ${playlists.length} playlists:
    ${playlists.map((p) => p.name).join(", ")}
  `);
}

seed().catch((e) => console.error(e));
