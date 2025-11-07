import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
    isLoading: false,
    submissions: [],
    submission: null,
    submissionCount: null,

    getAllSubmissions: async () => {
        try {
            set({ isLoading: true });

            const res = await axiosInstance.get(
                "/submission/get-all-submissions"
            );
            set({ submissions: res.data.submissions });

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error fetching all submissions", error);
            toast.error("Error fetching submissions");
        } finally {
            set({ isLoading: false });
        }
    },

    getSubmissionForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(
                `/submission/get-submission/${problemId}`
            );

            set({ submission: res.data.submission });
        } catch (error) {
            console.log("Error fetching problem submission", error);
            toast.error("Error fetching submission");
        }
    },

    getSubmissionCountForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(
                `/submission/get-submissions-count/${problemId}`
            );

            set({ submissionCount: res.data.submissionCount });
        } catch (error) {
            console.log("Error fetching submission count for problem", error);
            toast.error("Error fetching submission count for problem");
        }
    },
}));
