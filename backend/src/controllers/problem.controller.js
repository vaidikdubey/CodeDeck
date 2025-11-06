import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

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

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a problem",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));

      //Received tokens against submissions from judge0
      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((response) => response.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log("Result after polling: ", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
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
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error creating new problem: ", error);
    res.status(500).json({
      error: "Error creating new problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json({
        error: "No problems found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching all problems: ", error);
    res.status(500).json({
      error: "Error fetching all problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.error("Error fetching problem by id: ", error);
    res.status(500).json({
      error: "Error fetching problem by id",
    });
  }
};

export const updateProblem = async (req, res) => {
  //find problem by id -> check
  //same as create problem
  //instead of create use update with where: id

  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to update problem",
    });
  }

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found to update",
      });
    }

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    //bug - update for case where these fields are not provided, partially updated
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((response) => response.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        console.log("Updated result after polling: ", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    //avoid overwriting and removing existing fields which are not present
    const dataToUpdate = {
      ...(title && { title }),
      ...(description && { description }),
      ...(difficulty && { difficulty }),
      ...(tags && { tags }),
      ...(examples && { examples }),
      ...(constraints && { constraints }),
      ...(testcases && { testcases }),
      ...(codeSnippets && { codeSnippets }),
      ...(referenceSolutions && { referenceSolutions }),
      userId: req.user.id,
    };

    //update db
    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem: ", error);
    res.status(500).json({
      error: "Error updating problem",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not authorized to delete this problem",
    });
  }

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    await db.problem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem by id: ", error);
    res.status(500).json({
      error: "Error deleting problem by id",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching solved problems: ", error);
    res.status(500).json({
      error: "Error fetching solved problems by user",
    });
  }
};
