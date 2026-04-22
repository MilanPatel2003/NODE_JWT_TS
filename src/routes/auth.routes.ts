import express from "express";
import verifySignUp from "../middlewares/verifySignup";
import { changePassword, generateToken, signIn, signUp } from "../controllers/auth.controller";
import { deleteCaptcha, generateCaptcha, verifyCaptcha } from "../middlewares/captcha";

const router =  express.Router()

router.post("/signup",[verifySignUp.checkDuplicateUser,verifyCaptcha],signUp)
router.post("/signin",[verifyCaptcha],signIn)
router.get("/captcha",generateCaptcha)
router.post("/captcha/delete",deleteCaptcha  )
router.post("/generatetoken", generateToken)

router.post("/changepassword", changePassword)

export default router