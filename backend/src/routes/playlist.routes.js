import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router()

playlistRoutes
    .route("/create-playlist")
    .post(authMiddleware, createPlaylist);

playlistRoutes
    .route("/")
    .get(authMiddleware, getAllListDetails)

playlistRoutes
    .route("/:playlistId")
    .get(authMiddleware, getPlaylistDetails);

playlistRoutes
    .route("/:playlistId/add-problem")
    .post(authMiddleware, addProblemToPlaylist);

playlistRoutes
    .route("/:playlistId")
    .delete(authMiddleware, deletePlaylist);

playlistRoutes
    .route("/:playlistId/remove-problem")
    .delete(authMiddleware, removeProblemFromPlaylist);

export default playlistRoutes;