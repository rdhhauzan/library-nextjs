import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../helpers/Bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;

  try {
    if (!data.username || !data.password) {
      res.status(403).json({
        message: "Please fill all the form!"
      })
    }

    const result = await prisma.user.create({
      data: {
        username: data.username,
        password: hashPassword(data.password),
      },
    });

    res.status(200).json({
      message: "User created successfully.",
    });
  } catch (err: any) {
    if (err.name == 'PrismaClientKnownRequestError') {
      res.status(403).json({
        message: "Username already exists."
      });
    }
    
    res.status(403).json(err);
  }
};
