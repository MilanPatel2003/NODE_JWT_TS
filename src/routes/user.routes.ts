import express from "express";
import {
  adminAccess,
  allAccess,
  userAccess,
} from "../controllers/user.controller";
import authJwt from "../middlewares/authJwt";

const router = express.Router();

router.get("/all", allAccess);
router.get("/user", authJwt.verifyToken, userAccess);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminAccess);

export default router;
