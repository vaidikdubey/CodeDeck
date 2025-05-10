import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);

submissionRoutes.get("/get-submission/:problmeId", authMiddleware, getSubmissionsForProblem);

submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem);

export default submissionRoutes;