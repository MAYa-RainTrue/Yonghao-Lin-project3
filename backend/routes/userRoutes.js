import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

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

        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                error: "Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: passwordHash
        });

        await newUser.save();

        res.cookie("username", username, {
            httpOnly: true,
            sameSite: "lax"
        });

        return res.status(201).json({
            message: "User registered successfully",
            username
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

        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const user = await User.findOne({ username });

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

        res.cookie("username", username, {
            httpOnly: true,
            sameSite: "lax"
        });

        return res.json({
            message: "Login successful",
            username
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to log in"
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("username");

    return res.json({
        message: "Logout successful"
    });
});

export default router;