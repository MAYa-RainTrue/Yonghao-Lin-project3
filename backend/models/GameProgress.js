import mongoose from "mongoose";

const gameProgressSchema = new mongoose.Schema(
    {
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SudokuGame",
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        board: {
            type: [[Number]],
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

gameProgressSchema.index({ gameId: 1, username: 1 }, { unique: true });

const GameProgress = mongoose.model("GameProgress", gameProgressSchema);

export default GameProgress;