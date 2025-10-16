import { Router } from "express";
import {
  loginOrRegisterUser,
  parseResume,
  analyzeContent,
  getReportById,
  getUserReports,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route for user login/registration
router.route("/login").post(loginOrRegisterUser);

// Protected routes (require a valid token)
router.use(verifyFirebaseToken); 

router.route("/parse-resume").post(upload.single("resume"), parseResume);
router.route("/analyze").post(analyzeContent);
router.route("/reports").get(getUserReports);
router.route("/report/:reportId").get(getReportById);

export default router;
