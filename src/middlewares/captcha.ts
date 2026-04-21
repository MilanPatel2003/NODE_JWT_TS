import { Request, Response } from "express";
import captcha from "svg-captcha";
import db from "../config/db.config";
import { ResultSetHeader } from "mysql2";

export const generateCaptcha = async (req: Request, res: Response) => {
  try {
    const cap = captcha.create({
      noise: 2,
      size: 5,
      color: true,
    });

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO captcha (answer,
expires_at,
used
) VALUES (?,DATE_ADD(NOW(),INTERVAL 5 MINUTE),false)`,
      [cap.text],
    );

    console.log(result);

    const captchaId = result.insertId;
    res.status(201).json({
      captchaId,
      captcha: `data:image/svg+xml;utf8,${encodeURIComponent(cap.data)}`,
    });

    return;
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const verifyCaptcha = async (req: Request, res: Response) => {

};
