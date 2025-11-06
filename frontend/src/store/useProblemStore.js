import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
    problems: [], //all problems
    problem: null,
    solvedProblems: [], //solved problems by user
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems: async () => {
        try {
            set({ isProblemsLoading: true });

            const res = await axiosInstance.get("/problems/get-all-problems");

            set({ problems: res.data.problems });
        } catch (error) {
            console.log("Error getting all problems", error);
            toast.error("Error fetching all problems");
        } finally {
            set({ isProblemsLoading: false });
        }
    },

    getProblemById: async (id) => {
        try {
            set({ isProblemLoading: true });

            const res = await axiosInstance.get(`/problems/get-problems/${id}`);

            set({ problem: res.data.problem });
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error getting problem", error);
            toast.error("Error fetching problem");
        } finally {
            set({ isProblemLoading: false });
        }
    },

    getSolvedProblemByUser: async () => {
        try {
            const res = await axiosInstance.get("/problems/get-solved-problem");

            set({ solvedProblems: res.data.problems });
        } catch (error) {
            console.log("Error getting solved problems", error);
            toast.error("Error fetching solved problems");
        }
    },
}));
