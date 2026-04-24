import { createContext, useContext, useEffect, useState } from "react";
import {
    getLoginStatus,
    loginUser,
    logoutUser,
    registerUser
} from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const data = await getLoginStatus();
                setUsername(data.username);
                setIsLoggedIn(true);
            } catch {
                setUsername(null);
                setIsLoggedIn(false);
            } finally {
                setAuthLoading(false);
            }
        }

        checkLoginStatus();
    }, []);

    async function handleRegister(usernameInput, passwordInput) {
        const data = await registerUser(usernameInput, passwordInput);
        setUsername(data.username);
        setIsLoggedIn(true);
        return data;
    }

    async function handleLogin(usernameInput, passwordInput) {
        const data = await loginUser(usernameInput, passwordInput);
        setUsername(data.username);
        setIsLoggedIn(true);
        return data;
    }

    async function handleLogout() {
        await logoutUser();
        setUsername(null);
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider
            value={{
                username,
                isLoggedIn,
                authLoading,
                register: handleRegister,
                login: handleLogin,
                logout: handleLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}