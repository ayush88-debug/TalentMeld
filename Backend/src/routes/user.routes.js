import { Router } from "express";
import {
  setAuthToken,
  clearAuthToken,
  parseResume,
  analyzeContent,
  getReportById,
  getUserReports,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication routes
router.route("/set-token").post(setAuthToken);
router.route("/clear-token").post(clearAuthToken);

// Protected routes
router.route("/parse-resume").post(verifyFirebaseToken, upload.single("resume"), parseResume);
router.route("/analyze").post(verifyFirebaseToken, analyzeContent);
router.route("/reports").get(verifyFirebaseToken, getUserReports);
router.route("/report/:reportId").get(verifyFirebaseToken, getReportById);

export default router;