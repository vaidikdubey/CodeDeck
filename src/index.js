import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//Importing all routes
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT ?? 8080;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello there, Welcome to CodeDeck🔥");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
