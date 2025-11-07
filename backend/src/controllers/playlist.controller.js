import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.user.id;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist: ", error);
    res.status(500).json({
      error: "Error creating playlist",
    });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error fetching playlists: ", error);
    res.status(500).json({
      error: "Error fetching playlists",
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist: ", error);
    res.status(500).json({
      error: "Error fetching playlist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const { problemIds } = req.body; //Multiple problem ids can be included

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid or missing problem id",
      });
    }

    //Create records for each problem in playlist
    const problemsInPlaylist = await db.ProblemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist: ", error);
    res.status(500).json({
      error: "Error adding problems to playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist: ", error);
    res.status(500).json({
      error: "Error deleting playlist",
    });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: "Invalid or missing problem id",
      });
    }

    const deletedProblem = await db.problemsInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems deleted from playlist",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error deleting problems from playlist: ", error);
    res.status(500).json({
      error: "Error deleting problems from playlist",
    });
  }
};
