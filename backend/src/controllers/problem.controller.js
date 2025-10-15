import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    //get data from req.body
    //check user role
    //loop through each reference solution for different languages
    //--------get judge0 language id for the current language
    //--------prepare judge0 submission for all the testcases
    //submit all test cases in one batch
    //returns [{token}, {token}]
    //extract tokens from response
    //poll judge0 until all submissions are done
    //validate that each test cases are passed (status_id === 3)
    //save the problems in the db after all validations pass

    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403)
            .json({
            error: "You are not allowed to create a problem"
        })
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            console.log(`Language ID for ${language}: ${languageId}`);

            if (!languageId) {
                return res.status(400)
                    .json({
                        error: `Language ${language} is not supported`
                    });
            }

            const submissions = testcases.map(({ input, output }) => ({
                language_id: languageId,
                source_code: solutionCode,
                stdin: input,
                expected_output: output
            }))

            console.log(`Submission for ${language}: `, submissions);

            //Received tokens against submissions from judge0
            const submissionResults = await submitBatch(submissions);

            console.log(`Submission Results [Tokens from Judge0] for ${language} : ${submissionResults}`);

            const tokens = submissionResults.map((response) => response.token);

            console.log(`Tokens for ${language}: ${tokens}`);

            const results = await pollBatchResults(tokens);

            console.log("Results array after polling: ", results);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                console.log("Result after polling: ", result);

                if (result.status_id !== 3) {
                    return res.status(400)
                        .json({
                        error: `Testcase ${i+1} failed for language ${language}`
                    })
                };
            }

            //save to db
            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    difficulty,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippets,
                    referenceSolutions,
                    userId: req.user.id
                }
            });
        }

        return res.status(201)
                .json({
                    success: true,
                    message: "Problem created successfully",
                    problem: newProblem
                });
    } catch (error) {
        console.error("Error creating new problem: ", error);
        res.status(500)
            .json({
                error: "Error creating new problem"
            });
    }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
