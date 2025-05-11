import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({
            error: "Failed to create playlist"
        })
    }
};

export const getAllListDetails = async (req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            playlists
        })
    } catch (error) {
        console.error("Error fetching all playlists:", error);
        res.status(500).json({
            error: "Failed to fetch all playlists"
        })
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
                        problem: true
                    }
                }
            }
        })
    
        if (!playlist) {
            return res.status(404).json({
                error: "Playlist not found"
            })
        }
    
        res.status(200).json({
            succes: true,
            message: "Playlist fetched successfully",
            playlist
        })
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({
            error: "Failed to fetch playlist"
        })
    }
};

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body; // Multiple problem ids will be sent

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                error: "Invalid or missing problems ID"
            })
        }

        // Create records for each problem in the playlist
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            }))
        })

        res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.error("Error adding problems to playlist:", error);
        res.status(500).json({
            error: "Failed to add problems to playlist"
        })        
    }
};

export const deletePlaylist = async (req, res) => {
    
};

export const removeProblemFromPlaylist = async (req, res) => {

};