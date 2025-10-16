import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import admin from "../firebase/config.js";

const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.idToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});

export { verifyFirebaseToken };