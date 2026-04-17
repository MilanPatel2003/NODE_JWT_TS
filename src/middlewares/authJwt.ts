import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/auth.config";
import { JwtPayload, RoleRow, User } from "../types";
import db from "../config/db.config";
interface AuthenticatedRequest extends Request {
  userId?: number;
  user?: User;
}

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers["authorization"];
  
  if (!token || typeof token !== "string") {
    res.status(403).json({ message: "No token provided!" });
    return;
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, config.secret) as JwtPayload;
    console.log(decoded);
    
    const [rows] = await db.query<User[]>(
      `SELECT * FROM users WHERE user_id = ?`,
      [decoded.id],
    );
    console.log(rows);
    

    if (rows.length == 0) {
      res.status(404).json({ message: "User Not found." });
      return;
    }
    req.user = rows[0];

    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const roleName = "admin";

    const [adminRole] = await db.query<RoleRow[]>(
      `SELECT role_id FROM roles WHERE role_name = ?`,
      [roleName],
    ); //mile-an 
    if (user?.role_id != adminRole[0].role_id) {
      res.status(404).json({ message: "Not permited!" });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
};

export default authJwt;
