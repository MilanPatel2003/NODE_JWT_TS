import { Request, Response, NextFunction } from "express";
import db from "../config/db.config";
import { User } from "../types";

const checkDuplicateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const [rows] = await db.query<User[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (rows.length > 0) {
      res.status(404).json({ message: "Email already found." });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const verifySignUp = {
  checkDuplicateUser,
};

export default verifySignUp;
