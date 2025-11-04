import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    //Validate test cases -> should be in array format
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing test cases",
      });
    }

    //Prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    //send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    //Poll judge0 for the results of all submitted tese cases
    const results = await pollBatchResults(tokens);

    console.log("Result from execution-------------");
    console.log(results);

    //Analyze test case results
    let allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim(); //Output returned from judge0
      const expected_output = expected_outputs[i]?.trim(); //Expected output passed

      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };

      // //debug steps
      // console.log(`Testcase #${i + 1}`);
      // console.log(`Input for testcase ${i + 1}: ${stdin[i]}`);
      // console.log(`Expected output for testcase ${i + 1}: ${expected_output}`);
      // console.log(`Actual output for testcase ${i + 1}: ${stdout}`);

      // console.log(`Matched: ${passed}`);
    });

    //store submission summary in db
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((res) => res.stdout)),
        stderr: detailedResults.some((res) => res.stderr)
          ? JSON.stringify(detailedResults.map((res) => res.stderr))
          : null,
        compileOutput: detailedResults.some((res) => res.compile_output)
          ? JSON.stringify(detailedResults.map((res) => res.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer", //Custom status
        memory: detailedResults.some((res) => res.memory)
          ? JSON.stringify(detailedResults.map((res) => res.memory))
          : null,
        time: detailedResults.some((res) => res.time)
          ? JSON.stringify(detailedResults.map((res) => res.time))
          : null,
      },
    });

    //If all passed = true -> mark problem as solved for current user
    if (allPassed) {
      await db.ProblemSolved.upsert({
        where: {
          //unique identifier as per schema
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {}, //since we don't want to update if the record already exists
        create: {
          userId,
          problemId,
        },
      });
    }

    //save individual test case results using detailedResult
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.TestCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code: ", error.message);
    res.status(500).json({
      error: "Code execution failed",
    });
  }
};
