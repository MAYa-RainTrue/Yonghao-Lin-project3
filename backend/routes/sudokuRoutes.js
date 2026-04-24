import express from "express";
import SudokuGame from "../models/SudokuGame.js";
import GameProgress from "../models/GameProgress.js";
import { generateRandomGameName } from "../utils/gameName.js";
import { getTemplateByDifficulty } from "../utils/sudokuTemplates.js";
import { validateCustomBoard } from "../utils/sudokuSolver.js";

const router = express.Router();

function cloneBoard(board) {
    return board.map((row) => [...row]);
}

async function generateUniqueGameName() {
    let name = generateRandomGameName();
    let existingGame = await SudokuGame.findOne({ name });

    while (existingGame) {
        name = generateRandomGameName();
        existingGame = await SudokuGame.findOne({ name });
    }

    return name;
}

function isValidBoardShape(board) {
    if (!Array.isArray(board)) return false;

    const size = board.length;
    if (![6, 9].includes(size)) return false;

    return board.every((row) => Array.isArray(row) && row.length === size);
}

router.get("/", async (req, res) => {
    try {
        const games = await SudokuGame.find({}, "name difficulty creatorUsername createdAt")
            .sort({ createdAt: -1 });

        return res.json(games);
    } catch (error) {
        return res.status(500).json({
            error: "Failed to fetch games"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { difficulty } = req.body;
        const username = req.cookies.username;

        if (!username) {
            return res.status(401).json({
                error: "You must be logged in to create a game"
            });
        }

        if (!difficulty || !["EASY", "NORMAL"].includes(difficulty)) {
            return res.status(400).json({
                error: "Difficulty must be EASY or NORMAL"
            });
        }

        const name = await generateUniqueGameName();
        const { board, solution } = getTemplateByDifficulty(difficulty);

        const newGame = new SudokuGame({
            name,
            difficulty,
            creatorUsername: username,
            initialBoard: cloneBoard(board),
            solution: cloneBoard(solution)
        });

        await newGame.save();

        return res.status(201).json({
            message: "Game created successfully",
            gameId: newGame._id,
            name: newGame.name
        });
    } catch (error) {
        console.error("POST /api/sudoku error:", error);
        return res.status(500).json({
            error: "Failed to create game"
        });
    }
});

router.post("/custom", async (req, res) => {
    try {
        const { board } = req.body;
        const username = req.cookies.username;

        if (!username) {
            return res.status(401).json({
                error: "You must be logged in to create a custom game"
            });
        }

        const validation = validateCustomBoard(board);

        if (!validation.valid) {
            return res.status(400).json({
                error: validation.error
            });
        }

        const name = await generateUniqueGameName();

        const newGame = new SudokuGame({
            name,
            difficulty: "NORMAL",
            creatorUsername: username,
            initialBoard: cloneBoard(board),
            solution: validation.solution
        });

        await newGame.save();

        return res.status(201).json({
            message: "Custom game created successfully",
            gameId: newGame._id,
            name: newGame.name
        });
    } catch (error) {
        console.error("POST /api/sudoku/custom error:", error);
        return res.status(500).json({
            error: "Failed to create custom game"
        });
    }
});

router.get("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;
        const username = req.cookies.username;

        const game = await SudokuGame.findById(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        if (!username) {
            return res.json({
                _id: game._id,
                name: game.name,
                difficulty: game.difficulty,
                creatorUsername: game.creatorUsername,
                initialBoard: game.initialBoard,
                board: cloneBoard(game.initialBoard),
                solution: game.solution,
                completed: false,
                isLoggedInViewer: false
            });
        }

        let progress = await GameProgress.findOne({ gameId, username });

        if (!progress) {
            progress = new GameProgress({
                gameId,
                username,
                board: cloneBoard(game.initialBoard),
                completed: false
            });

            await progress.save();
        }

        return res.json({
            _id: game._id,
            name: game.name,
            difficulty: game.difficulty,
            creatorUsername: game.creatorUsername,
            initialBoard: game.initialBoard,
            board: progress.board,
            solution: game.solution,
            completed: progress.completed,
            isLoggedInViewer: true
        });
    } catch (error) {
        console.error("GET /api/sudoku/:gameId error:", error);
        return res.status(500).json({
            error: "Failed to fetch game"
        });
    }
});

router.put("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { board, completed } = req.body;
        const username = req.cookies.username;

        if (!username) {
            return res.status(401).json({
                error: "You must be logged in to save progress"
            });
        }

        if (!isValidBoardShape(board)) {
            return res.status(400).json({
                error: "A valid 6x6 or 9x9 board is required"
            });
        }

        const game = await SudokuGame.findById(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        const updateData = { board };

        if (typeof completed === "boolean") {
            updateData.completed = completed;
        }

        const updatedProgress = await GameProgress.findOneAndUpdate(
            { gameId, username },
            updateData,
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        return res.json({
            message: "Game progress updated successfully",
            progress: updatedProgress
        });
    } catch (error) {
        console.error("PUT /api/sudoku/:gameId error:", error);
        return res.status(500).json({
            error: "Failed to update game progress"
        });
    }
});

router.delete("/:gameId", async (req, res) => {
    try {
        const { gameId } = req.params;
        const username = req.cookies.username;

        if (!username) {
            return res.status(401).json({
                error: "You must be logged in to delete a game"
            });
        }

        const game = await SudokuGame.findById(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        if (game.creatorUsername !== username) {
            return res.status(403).json({
                error: "Only the creator can delete this game"
            });
        }

        await GameProgress.deleteMany({ gameId });
        await SudokuGame.findByIdAndDelete(gameId);

        return res.json({
            message: "Game deleted successfully"
        });
    } catch (error) {
        console.error("DELETE /api/sudoku/:gameId error:", error);
        return res.status(500).json({
            error: "Failed to delete game"
        });
    }
});

export default router;