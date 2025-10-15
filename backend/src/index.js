import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


//import custom routes
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello, welcome to CodeDeck🔥")
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})