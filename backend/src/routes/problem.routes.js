import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes
    .route("/create-problem")
    .post(authMiddleware, checkAdmin, createProblem);

problemRoutes
    .route("/get-all-problems")
    .get(authMiddleware, getAllProblems);

problemRoutes
    .route("/get-problem/:id")
    .get(authMiddleware, getProblemById);

problemRoutes
    .route("/update-problem/:id")
    .put(authMiddleware, checkAdmin, updateProblem);
    
problemRoutes
    .route("/delete-problem/:id")
    .delete(authMiddleware, checkAdmin, deleteProblem);

problemRoutes
    .route("/get-solved-problems")
    .get(authMiddleware, getAllProblemsSolvedByUser);

export default problemRoutes;