import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes
    .route("/get-all-submissions")
    .get(authMiddleware, getAllSubmission);

submissionRoutes
    .route("/get-submission/:problemId")
    .get(authMiddleware, getSubmissionsForProblem);

submissionRoutes
    .route("/get-submissions-count/:problemId")
    .get(authMiddleware, getAllTheSubmissionsForProblem);

export default submissionRoutes;