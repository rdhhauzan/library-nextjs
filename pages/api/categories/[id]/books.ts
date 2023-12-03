import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id, title, minYear, maxYear, minPage, maxPage, sortByTitle } = req.query;
      
        const category = await prisma.category.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            books: {
              where: {
                title: {
                  contains: title ? String(title) : undefined,
                  mode: 'insensitive', // Case-insensitive search
                },
                release_year: {
                  gte: minYear ? parseInt(minYear as string) : undefined,
                  lte: maxYear ? parseInt(maxYear as string) : undefined,
                },
                total_page: {
                  gte: minPage ? parseInt(minPage as string) : undefined,
                  lte: maxPage ? parseInt(maxPage as string) : undefined,
                },
              },
              orderBy: sortByTitle
                ? {
                    title: sortByTitle === 'desc' ? 'desc' : 'asc',
                  }
                : undefined,
            },
          },
        });
      
        if (!category) {
          return res.status(404).json({ error: "Category not found" });
        }
      
        // Extract the filtered books from the category
        const filteredBooks = category.books;
      
        res.status(200).json({ ...category, books: filteredBooks });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
};
