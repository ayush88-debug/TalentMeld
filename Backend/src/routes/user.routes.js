import { Router } from "express";
import { registerOrLoginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/google-login").post(registerOrLoginUser);

export default router;
