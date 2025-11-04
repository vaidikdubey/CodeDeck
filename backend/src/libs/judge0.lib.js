import axios from "axios";

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
        "TYPESCRIPT": 74
    }

    return languageMap[language.toUpperCase()];
}

export const getLanguageName = (languageId) => {
    const LANGUAGE_NAMES = {
        74: "Typescript",
        63: "Javascript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.RAPIDAPI_JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            },
            headers: {
                'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.X_RAPIDAPI_HOST
            }
        })

        const results = data.submissions;

        const isAllDone = results.every((res) => res.status.id !== 1 && res.status.id !== 2);

        if (isAllDone) return results;

        //Wait before hitting the endpoint again
        await sleep(1000); //1sec delay
    }
}

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(`${process.env.RAPIDAPI_JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        { submissions },
        {
            headers: {
                'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
                'Content-Type': 'application/json'
            }
        }
    );

    console.log("Submission Results [Tokens from Judge0]: ", data);

    return data;
}