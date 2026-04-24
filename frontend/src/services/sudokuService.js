import { apiFetch } from "./api";

export async function fetchAllGames() {
    return apiFetch("/api/sudoku");
}

export async function createGame(difficulty) {
    return apiFetch("/api/sudoku", {
        method: "POST",
        body: JSON.stringify({ difficulty })
    });
}

export async function fetchGameById(gameId) {
    return apiFetch(`/api/sudoku/${gameId}`);
}

export async function updateGameBoard(gameId, board, completed = false) {
    return apiFetch(`/api/sudoku/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ board, completed })
    });
}

export async function deleteGame(gameId) {
    return apiFetch(`/api/sudoku/${gameId}`, {
        method: "DELETE"
    });
}

export async function createCustomGame(board) {
    return apiFetch('/api/sudoku/custom', {
        method: 'POST',
        body: JSON.stringify({ board })
    });
}