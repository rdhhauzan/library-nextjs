import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
 if (req.method === "PATCH") {
    try {
        const query = req.query
        const { id } = query
        const { title, description, image, release_year, price, total_page, category } = req.body;

        if (!title || !description || !image || !release_year || !price || !total_page || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (release_year < 1980 || release_year > 2021) {
            return res.status(400).json({ error: "Release year can only between 1980 and 2021" });
        }

        const nextId = await prisma.book.findFirst({
            orderBy: {
                id: "asc"
            }
        })

        const createdBook = await prisma.book.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                description,
                release_year,
                price,
                image_url: image,
                total_page,
                category_id: Number(category),
                thickness: total_page <= 100 ? "Tipis" : total_page <= 200 ? "Sedang" : "Tebal",
            },
        });

        res.status(201).json(createdBook);
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
