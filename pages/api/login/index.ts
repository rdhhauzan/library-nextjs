import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../../../helpers/Bcrypt";
import { createToken } from "../../../helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(403).json({
        message: "Please fill all the form!",
      });
    }

    // Check if the user exists
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (!existingUser) {
      return res.status(403).json({
        message: "User not found.",
      });
    }

    const isPasswordValid = await comparePassword(password, existingUser.password);

    if (isPasswordValid) {
      const token = createToken({ userId: existingUser.id });
      return res.status(200).json({
        message: "Logged in successfully.",
        access_token : token,
        user_id : existingUser.id
      });
    } else {
      return res.status(403).json({
        message: "Invalid credentials.",
      });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
