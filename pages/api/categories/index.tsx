import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const data = await prisma.category.findMany();

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name } = req.body;
    
      if (!name) {
        return res.status(400).json({ error: "All fields are required" });
      }
    
      const createdCategory = await prisma.category.create({
        data: {
          name,
        },
      });
    
      res.status(201).json(createdCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
