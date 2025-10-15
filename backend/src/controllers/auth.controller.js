import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.USER
            }
        })

        const token = jwt.sign({ id: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' });
        
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        })

        res.status(201)
            .json({
                success: true,
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    role: newUser.role,
                    image: newUser.image
                }
        })
    } catch (error) {
        console.error("Error creating user", error)
        res.status(500)
            .json({ error: "Error creating user"});
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "All fields are required" });

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if (!user) return res.status(401).json({ error: "User not found" });
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        
        const token = jwt.sign({ id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        })

        res.status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    image: user.image
                }
        })
    } catch (error) {
        console.error("Error logging in user", error)
        res.status(500)
            .json({ error: "Error logging in user"});
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        })

        res.status(200)
            .json({
                success: true,
                message: "User logged out successfully"
            })
    } catch (error) {
        console.error("Error logging out", error);
        res.status(500)
            .json({ error: "Error logging out"});
    }
}

export const getProfile = async (req, res) => {
    try {
        res.status(200)
            .json({
                success: true,
                message: "User profile found successfully",
                user: req.user
            });
    } catch (error) {
        console.error("Error finding user profile", error);
        res.status(500).json({
            error: "Error finding user profile"
        });
    }
}