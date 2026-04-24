import { apiFetch } from "./api";

export async function fetchHighScores() {
    return apiFetch("/api/highscore");
}