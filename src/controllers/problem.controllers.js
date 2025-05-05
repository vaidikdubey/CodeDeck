import { db } from "../libs/db.js";

export const createProblem = async (req, res) => {
    // 1 - Get all the data from request body
    // 2 - Check user role if ADMIN or not
    // 3 - Loop through each reference solution for different languages
        // Get Judge0 language id for current language
        // Prepare Judge0 submissions for all testcases
        // Submit all test cases in one batch - (Enhancement) => Convert submissions to chunks of 20.
        // Extract tokens from response - returns [{token}, {token}]
        // Poll Judge0 until all submissions are done
        // Validate that each test case has passed (status.id === 3)
    // 4 - Save problem in database after all validations pass

    //Step 1
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippet, referenceSolutions } = req.body;
    
    //Step 2
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            error: "You are not allowed to create a problem"
        })
    }

    try {
        //Step 3
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Language ${language} is not supported`
                })
            }
        }
    } catch (error) {
        
    }
};

export const getAllProblems = async (req, res) => {

};

export const getProblemById = async (req, res) => {

};

export const updateProblem = async (req, res) => {

};

export const deleteProblem = async (req, res) => {

};

export const getAllProblemsSolvedByUser = async (req, res) => {

};