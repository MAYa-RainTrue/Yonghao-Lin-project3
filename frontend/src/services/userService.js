import { apiFetch } from "./api";

export async function registerUser(username, password) {
    return apiFetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
}

export async function loginUser(username, password) {
    return apiFetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
}

export async function logoutUser() {
    return apiFetch("/api/user/logout", {
        method: "POST"
    });
}

export async function getLoginStatus() {
    return apiFetch("/api/user/isLoggedIn");
}