import { Router } from "express";
import {
  registerOrLoginUser,
  parseResume,
  analyzeContent,
  getReportById,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.route("/google-login").post(registerOrLoginUser);

// Protected routes
router.route("/parse-resume").post(verifyFirebaseToken, upload.single("resume"), parseResume);
router.route("/analyze").post(verifyFirebaseToken, analyzeContent);
router.route("/report/:reportId").get(verifyFirebaseToken, getReportById);

export default router;