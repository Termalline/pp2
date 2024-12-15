import prisma from "@/utils/db";
import { hashPassword } from "@/utils/auth";

export default async function handler(req, res) {
    // Register a new user
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, password, picture, number, darkMode } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({ error: "name, email, password, are required" });
    }
    if (number.length > 15) {
        return res.status(401).json({ error: "Invalid number entered" });
    }


    if (await prisma.user.findUnique({ where: { email } })) {
        return res.status(402).json({ error: "Email has already been used to register" });
    }

    // Create a new user in the prisma database
    await prisma.user.create({
        data: {
            name,
            email,
            password: await hashPassword(password),
        },
    });
    // updates the given optional fields
    if (picture) {
        await prisma.user.update({
            where: {
                email,
            },
            data: {
                picture,
            },
        });
    }
    if (number) {
        await prisma.user.update({
            where: {
                email,
            },
            data: {
                number: parseInt(number),
            },
        });
    }
    if (darkMode == true || darkMode == false) {
        await prisma.user.update({
            where: {
                email,
            },
            data: {
                darkMode,
            },
        });
    }

    return res.status(200).json({ message: "User created successfully. " + "Welcome " + name });
}

