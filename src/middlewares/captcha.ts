import { NextFunction, Request, Response } from "express";
import captcha from "svg-captcha";
import db from "../config/db.config";
import { ResultSetHeader } from "mysql2";

export const generateCaptcha = async (req: Request, res: Response) => {
  try {
    await db.query(`DELETE FROM captcha WHERE expires_at <= NOW()`);
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

export const verifyCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
      await db.query(`DELETE FROM captcha WHERE expires_at <= NOW()`);

  const { captchaId, captchaText } = req.body;
  const [result] = await db.query<any>(
    `SELECT * FROM captcha WHERE captch_id=?`,
    [captchaId],
  );
  if (result.length === 0) {
    res.status(400).json({message:"Captcha does not exist!"})
  }
  const answer = result[0].answer;
  console.log(answer);
  if (answer === captchaText) {
    await db.query<any>(`delete from captcha where captch_id=?`, [captchaId]);
    next();
  } else {
    res.status(403).json({ message: "Invalid captcha!" });
    return;
  }
};

export const deleteCaptcha = async (req: Request, res: Response) => {
  const { captchaId } = req.body;
  try {
    await db.query<any>(`delete from captcha where captch_id=?`, [captchaId]);
    res.status(200).json({ message: "captcha deleted" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
