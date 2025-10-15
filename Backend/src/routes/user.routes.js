import { Router } from "express";
import { registerOrLoginUser, parseResume } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/google-login").post(registerOrLoginUser);
router.route("/parse-resume").post(upload.single("resume"), parseResume);

export default router;