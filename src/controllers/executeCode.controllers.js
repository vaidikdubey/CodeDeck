import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;

        const userId = req.user.id;

        // Validate test cases -> If the format of testcases (stdin) are in Array format
        if (!Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length)
        {
            return res.status(400).json({
                error: "Invalid or missing test cases"
            })
        }

        // Prepare each test cases for Judge0 batch submission
        const submission = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input
        }))

        // Send the batch of submissions to Judge0
        const submitResponse = await submitBatch(submission)

        const tokens = submitResponse.map((res) => res.token);

        // Poll Judge0 for results of all submitted test cases
        const results = await pollBatchResults(tokens);

        console.log('Result from User Submission-------');
        console.log(results);
        
        res.status(200).json({
            message: "Code Executed"
        })
    } catch (error) {
        
    }
}