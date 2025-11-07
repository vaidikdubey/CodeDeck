import { db } from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where: {
                userId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.error("Errro fetching submissions: ", error)
        res.status(500).json({
            error: "Failed to fetch submissions"
        })
    }
}

export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;

        const { problemId } = req.params;

        const submission = await db.submission.findMany({
            where: {
                userId,
                problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submission for problem fetched successfully",
            submission
        })
    } catch (error) {
        console.error("Errro fetching submissions by id: ", error)
        res.status(500).json({
            error: "Failed to fetch submissions for problem"
        })
    }
}

export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const { problemId } = req.params;

        //find count of submissions
        const submissionCount = await db.submission.count({
            where: {
                problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            submissionCount
        })
    } catch (error) {
        console.error("Errro fetching submission count: ", error)
        res.status(500).json({
            error: "Failed to fetch submission count"
        })
    }
}