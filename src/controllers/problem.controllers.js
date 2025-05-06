import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

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

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            const submissionResults = await submitBatch(submissions);

            //Extracting tokens from submissions returned by Judge0
            const tokens = submissionResults.map((res) => res.token);

            //Polling results from Judge0
            const results = await pollBatchResults(token);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            //Step 4
            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippet,
                    referenceSolutions,
                    userId: req.user.id,
                }
            })

            return res.status(201).json(newProblem);
        }
    } catch (error) {
        console.error("Error creating problem: ", error);
        return res.status(500).json({
            error: "Error creating problem"
        })
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