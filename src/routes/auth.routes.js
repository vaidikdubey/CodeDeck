import express from "express";
import { check, login, logout, register } from "../controllers/auth.controllers.js";

const authRoutes = express.Router();

//Routes
authRoutes.post("/register", register)

authRoutes.post("/login", login)

authRoutes.post("/logout", logout)

authRoutes.get("/check", check)

export default authRoutes