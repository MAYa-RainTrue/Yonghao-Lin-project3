import mongoose from "mongoose";

const sudokuGameSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["EASY", "NORMAL"]
        },
        creatorUsername: {
            type: String,
            required: true,
            default: "Guest"
        },
        initialBoard: {
            type: [[Number]],
            required: true
        },
        solution: {
            type: [[Number]],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const SudokuGame = mongoose.model("SudokuGame", sudokuGameSchema);

export default SudokuGame;