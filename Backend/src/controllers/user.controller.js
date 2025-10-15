import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import admin from "../firebase/config.js";
import { User } from "../models/user.model.js";
import {PDFParse } from "pdf-parse";
import * as mammoth from "mammoth";
import fs from "fs";

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

const parseResume = asyncHandler(async (req, res) => {
  const resumeLocalPath = req.file?.path;

  if (!resumeLocalPath) {
    throw new ApiError(400, "Resume file is required");
  }

  let text = "";

  try {
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(resumeLocalPath);
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      text = data.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Use the 'default' export from the imported namespace
      const result = await mammoth.default.extractRawText({ path: resumeLocalPath });
      text = result.value;
    } else {
      throw new ApiError(
        400,
        "Unsupported file type. Please upload a PDF or DOCX file."
      );
    }

    // Clean up the temporary file
    fs.unlinkSync(resumeLocalPath);

    return res
      .status(200)
      .json(new ApiResponse(200, { text }, "Resume parsed successfully"));
  } catch (error) {
    if (fs.existsSync(resumeLocalPath)) {
      fs.unlinkSync(resumeLocalPath);
    }
    console.error(error);
    throw new ApiError(
      500,
      error.message || "Failed to parse the resume file."
    );
  }
});

export { registerOrLoginUser, parseResume };