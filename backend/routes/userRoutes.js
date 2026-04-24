import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/"
};

router.get("/isLoggedIn", (req, res) => {
    const username = req.cookies.username;

    if (!username) {
        return res.status(401).json({
            loggedIn: false,
            error: "Not logged in"
        });
    }

    return res.json({
        loggedIn: true,
        username
    });
});

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const trimmedUsername = username?.trim();

        if (!trimmedUsername || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const existingUser = await User.findOne({ username: trimmedUsername });

        if (existingUser) {
            return res.status(400).json({
                error: "Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: trimmedUsername,
            password: passwordHash
        });

        await newUser.save();

        res.cookie("username", trimmedUsername, cookieOptions);

        return res.status(201).json({
            message: "User registered successfully",
            username: trimmedUsername
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to register user"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const trimmedUsername = username?.trim();

        if (!trimmedUsername || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const user = await User.findOne({ username: trimmedUsername });

        if (!user) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        res.cookie("username", trimmedUsername, cookieOptions);

        return res.json({
            message: "Login successful",
            username: trimmedUsername
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to log in"
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("username", cookieOptions);

    return res.json({
        message: "Logout successful"
    });
});

export default router;