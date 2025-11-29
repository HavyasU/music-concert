import { adminModel } from "../models/adminModel.js";
import jwt from "jsonwebtoken";

// Admin login
export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const adminExists = await adminModel.findOne({ username });

        if (!adminExists) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // In production, use bcrypt for password hashing
        const isPasswordValid = adminExists.password === password;

        if (isPasswordValid) {
            // Create JWT token
            const token = jwt.sign(
                { id: adminExists._id, username: adminExists.username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                admin: {
                    id: adminExists._id,
                    username: adminExists.username
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }
    } catch (error) {
        console.log("Error while admin login", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Register new admin (for setup purposes)
export const registerAdmin = async (req, res) => {
    try {
        const { username, password, phone } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const adminExists = await adminModel.findOne({ username });

        if (adminExists) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const newAdmin = new adminModel({
            username,
            password, // In production, hash this with bcrypt
            phone
        });

        await newAdmin.save();

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: newAdmin._id,
                username: newAdmin.username
            }
        });
    } catch (error) {
        console.log("Error while registering admin", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
