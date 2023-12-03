import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        const data = await prisma.category.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                books: true,
            }
        });

        if (!data) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
