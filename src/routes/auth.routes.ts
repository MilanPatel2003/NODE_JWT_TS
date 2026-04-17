import express from "express";
import verifySignUp from "../middlewares/verifySignup";
import { signIn, signUp } from "../controllers/auth.controller";

const router =  express.Router()

router.post("/signup",[verifySignUp.checkDuplicateUser],signUp)
router.post("/signin",signIn)

export default router