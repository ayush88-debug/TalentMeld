import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import admin from "../firebase/config.js";
import { User } from "../models/user.model.js";

const registerOrLoginUser = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "ID token is required");
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  if (!decodedToken) {
    throw new ApiError(401, "Invalid Firebase token");
  }

  const { uid, email, name, picture } = decodedToken;

  let user = await User.findOne({ firebaseId: uid });

  if (!user) {
    user = await User.create({
      firebaseId: uid,
      email: email,
      name: name,
      avatar: picture || "",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User logged in successfully"));
});

export { registerOrLoginUser };
