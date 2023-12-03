import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
 if (req.method === "PATCH") {
    try {
        const query = req.query
        const { id } = query
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const createdCategory = await prisma.category.update({
            where: {
                id: Number(id)
            },
            data: {
                name
            },
        });

        res.status(201).json(createdCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
        const { id } = req.query;

        const data = await prisma.category.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!data) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
        const { id } = req.query;

        const data = await prisma.category.delete({
            where: {
                id: Number(id),
            },
        });

        if (!data) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
  }
};
