import prisma from "@/utils/db";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { access } from "fs";

export default async function handler(req, res) {
    // Login a user, giving them an access token and a refresh token
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email, password are required" });
    }                                       
    
    const user = await prisma.user.findUnique({ where: { email } });


    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({"error": "Invalid credentials"});
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role, name: user.name });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role, name: user.name });

    return res.status(200).json({accessToken, refreshToken});

}
