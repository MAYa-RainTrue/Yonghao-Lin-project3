import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import sudokuRoutes from "./routes/sudokuRoutes.js";
import highscoreRoutes from "./routes/highscoreRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/sudoku", sudokuRoutes);
app.use("/api/highscore", highscoreRoutes);

app.get("/api/health", (req, res) => {
    res.json({ message: "Backend is running." });
});

async function startServer() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();