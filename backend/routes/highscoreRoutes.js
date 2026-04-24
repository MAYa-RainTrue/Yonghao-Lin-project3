import express from "express";
import GameProgress from "../models/GameProgress.js";
import SudokuGame from "../models/SudokuGame.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const scores = await GameProgress.aggregate([
            {
                $match: {
                    completed: true
                }
            },
            {
                $lookup: {
                    from: "sudokugames",
                    localField: "gameId",
                    foreignField: "_id",
                    as: "game"
                }
            },
            {
                $unwind: "$game"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "username",
                    foreignField: "username",
                    as: "matchedUsers"
                }
            },
            {
                $match: {
                    "matchedUsers.0": { $exists: true }
                }
            },
            {
                $group: {
                    _id: "$username",
                    wins: { $sum: 1 },
                    games: {
                        $push: {
                            gameId: "$game._id",
                            gameName: "$game.name",
                            difficulty: "$game.difficulty"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    username: "$_id",
                    wins: 1,
                    games: 1
                }
            },
            {
                $sort: {
                    wins: -1,
                    username: 1
                }
            }
        ]);

        return res.json(scores);
    } catch (error) {
        console.error("GET /api/highscore error:", error);
        return res.status(500).json({
            error: "Failed to fetch high scores"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const username = req.cookies.username;
        const { gameId } = req.body;

        if (!username) {
            return res.status(401).json({
                error: "You must be logged in to update high score"
            });
        }

        if (!gameId) {
            return res.status(400).json({
                error: "Game ID is required"
            });
        }

        const game = await SudokuGame.findById(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        const progress = await GameProgress.findOneAndUpdate(
            { gameId, username },
            {
                gameId,
                username,
                board: game.solution,
                completed: true
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.json({
            message: "High score updated successfully",
            progress
        });
    } catch (error) {
        console.error("POST /api/highscore error:", error);
        return res.status(500).json({
            error: "Failed to update high score"
        });
    }
});

router.get("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;

        const game = await SudokuGame.findById(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        const scores = await GameProgress.find(
            {
                gameId,
                completed: true
            },
            "username updatedAt"
        ).sort({
            updatedAt: 1,
            username: 1
        });

        return res.json({
            gameId: game._id,
            gameName: game.name,
            difficulty: game.difficulty,
            scores: scores.map((score, index) => ({
                rank: index + 1,
                username: score.username,
                completedAt: score.updatedAt
            }))
        });
    } catch (error) {
        console.error("GET /api/highscore/:gameId error:", error);
        return res.status(500).json({
            error: "Failed to fetch high score for game"
        });
    }
});

export default router;