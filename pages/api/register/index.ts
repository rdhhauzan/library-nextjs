import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../helpers/Bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        username: data.username,
        password: hashPassword(data.password),
      },
    });

    res.status(200).json({
      message: "User created successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ err: "Error occurred while adding a new user." });
  }
};
