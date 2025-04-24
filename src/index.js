import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config()

const app = express()

const port = process.env.PORT ?? 8080

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello there, Welcome to CodeDeck🔥")
})

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})