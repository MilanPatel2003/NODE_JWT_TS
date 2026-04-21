import express from "express";
import verifySignUp from "../middlewares/verifySignup";
import { signIn, signUp } from "../controllers/auth.controller";
import { generateCaptcha } from "../middlewares/captcha";

const router =  express.Router()

router.post("/signup",[verifySignUp.checkDuplicateUser],signUp)
router.post("/signin",signIn)
router.get("/captcha",generateCaptcha)

export default router