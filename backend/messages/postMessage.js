import { pool } from "../server.js";
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateAnonymous(req, res) {
    const { name, email } = req.body;

    if (!name && !email) {
        res.status(400).json({ message: "Name and email are required" });
        return null;
    } else if (!name) {
        res.status(400).json({ message: "Name is required" });
        return null;
    }else if (!email) {
        res.status(400).json({ message: "email is required" });
        return null;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return null;
    }

    return { name, email };
}

router.post("/", async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage || userMessage.trim() === "") {
            return res.status(400).json({ message: "Message content is required" });
        }

        const token = req.cookies.authToken;
        let name, email, userId = null;

        if (!token) {
            const result = validateAnonymous(req, res);
            if (!result) return;
            ({ name, email } = result);
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
            email = decoded.email;

            const userResult = await pool.query(
                `SELECT firstname, lastname FROM users WHERE id = $1 LIMIT 1`,
                [userId]
            );

            if (userResult.rowCount === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const { firstname, lastname } = userResult.rows[0];
            name = `${firstname} ${lastname}`;
        }

        const insertResult = await pool.query(
            `INSERT INTO messages(sender, email, message, user_id)
       VALUES ($1, $2, $3, $4)`,
            [name, email, userMessage, userId]
        );

        if (insertResult.rowCount === 1) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ message: "Failed to save message" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;