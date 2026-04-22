import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import db from "../config/db.config";
import { JwtPayload, RoleRow, SignUpBody, User } from "../types";
import { ResultSetHeader } from "mysql2";
import jwt from "jsonwebtoken";
import config from "../config/auth.config";

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }

    const [rows] = await db.query<User[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (rows.length == 0) {
      res.status(404).json({ message: "User Not found." });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      rows[0].password,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid details!",
      });
      return;
    }

    const payload: JwtPayload = {
      id: rows[0].user_id,
      email: rows[0].email,
      role: rows[0].role_id,
    };

    const token = jwt.sign(payload, config.secret, {
      algorithm: "HS256",
      expiresIn: config.expire,
    });

    res.status(200).json({
      accessToken: token,
      message: "Sign In successfull!",
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      user_name,
      email,
      password: plain,
    } = req.body as SignUpBody;
    console.log(req.body);

    const password = bcrypt.hashSync(plain, 8);
    const role_name = "user";

    const [roleRows] = await db.query<RoleRow[]>(
      `SELECT role_id, role_name FROM roles WHERE role_name = ?`,
      [role_name],
    );

    const role_id: number = roleRows[0].role_id;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO users (first_name, last_name, user_name, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, user_name, email, password, role_id],
    );

    res.status(201).json({
      id: result.insertId,
      message: "User created successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const generateToken = async (req: Request, res: Response) => {
  console.log(req.body);
  
  try {
    const { email } = req.body;
    const [rows] = await db.query<User[]>(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Email not found." });
      return;
    }

    const emailToken = jwt.sign({ email }, config.secret, {
      algorithm: "HS256",
      expiresIn: 300,
    });

    res.status(201).json({ message: "Unique token generated!", emailToken });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  interface emailJwtPayload {
    email?: string;
  }
  try {
    const { emailToken, newPassword } = req.body;
    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

    const decodeEmail = jwt.verify(
      emailToken,
      config.secret,
    ) as emailJwtPayload;

    const email = decodeEmail.email;
    const [rows] = await db.query<User[]>(
      `SELECT password FROM users WHERE email = ?`,
      [email],
    );
    const password = rows[0].password;

    if (password === hashedNewPassword) {
      res
        .status(400)
        .json({ message: "Can not use old password as new password!" });
      return;
    }

    await db.query<any>(`UPDATE users SET password=? WHERE email=?`, [
      hashedNewPassword,
      email,
    ]);
    res.status(201).json({ message: "Successfully changed password!" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
