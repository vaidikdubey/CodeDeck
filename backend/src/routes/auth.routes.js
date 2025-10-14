import express from "express";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router()

authRoutes
    .route("/register")
    .post(registerUser);

authRoutes
    .route("/login")
    .post(loginUser);

authRoutes
    .route("/logout")
    .get(authMiddleware, logoutUser);

authRoutes
    .route("/profile")
    .get(authMiddleware, getProfile);

export default authRoutes