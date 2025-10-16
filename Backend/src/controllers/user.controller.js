import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import admin from "../firebase/config.js";
import { User } from "../models/user.model.js";
import { AnalysisReport } from "../models/analysis.model.js"; 
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

const analyzeContent = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  const userId = req.user.uid;

  if (!resumeText || !jobDescription) {
    throw new ApiError(400, "Resume text and job description are required.");
  }

  const mockAnalysis = {
    jobTitle: "Software Engineer",
    companyName: "Tech Solutions Inc.",
    matchScore: 78,
    keywordAnalysis: {
      found: ["JavaScript", "React", "Node.js", "API"],
      missing: ["GraphQL", "TypeScript", "CI/CD"],
    },
    
    resumeSuggestions: [
      {
        section: "Header & Contact Info",
        suggestions: [
          {
            insight: "Include a link to your live portfolio or GitHub profile to showcase your work.",
            original: "New York, NY | (123) 456-7890",
            suggestion: "New York, NY | (123) 456-7890 | portfolio.com | github.com/username",
          },
        ],
      },
      {
        section: "Skills Summary",
        suggestions: [
          {
            insight: "The job description emphasizes 'TypeScript'. Add it to your skills list to pass ATS scans.",
            original: "JavaScript, React, Node.js, Express, MongoDB",
            suggestion: "TypeScript, JavaScript, React, Node.js, Express, MongoDB",
          },
        ],
      },
      {
        section: "Work Experience",
        suggestions: [
          {
            insight: "Quantify your achievements using the STAR method to demonstrate impact.",
            original: "Responsible for building the backend API for Project X.",
            suggestion: "Engineered a RESTful API for Project X, which improved data retrieval times by 30% for over 10,000 daily users.",
          },
           {
            insight: "Use stronger action verbs to describe your responsibilities.",
            original: "Worked on the frontend user interface.",
            suggestion: "Developed and maintained a responsive user interface using React, leading to a 15% increase in user engagement.",
          },
        ],
      },
    ],
    
    generatedCoverLetter: {
        Professional: `Dear Hiring Manager,\n\nI am writing to express my keen interest in the Software Engineer position at Tech Solutions Inc. My experience with JavaScript, React, and Node.js aligns well with the requirements of this role.\n\nI am confident that my technical skills and proactive approach would make me a valuable asset to your team.\n\nThank you for your consideration.\n\nSincerely,\n[Your Name]`,
        Enthusiastic: `Dear Hiring Team,\n\nI was thrilled to see the opening for a Software Engineer at Tech Solutions Inc.! I am incredibly passionate about building innovative solutions and my background in creating dynamic applications with React and Node.js feels like a perfect match for this opportunity.\n\nI am very excited about the possibility of contributing to your team's success.\n\nBest regards,\n[Your Name]`,
        Concise: `Dear Hiring Manager,\n\nI am applying for the Software Engineer position. My skills in JavaScript, React, and Node.js, combined with my experience in backend API development, meet your core requirements.\n\nI am confident I can contribute effectively to your team. I look forward to hearing from you.\n\nRegards,\n[Your Name]`,
    },
  };
  // --- END OF MOCKED AI RESPONSE ---

  const report = await AnalysisReport.create({
    userId,
    jobTitle: mockAnalysis.jobTitle,
    companyName: mockAnalysis.companyName,
    matchScore: mockAnalysis.matchScore,
    keywordAnalysis: mockAnalysis.keywordAnalysis,
    resumeSuggestions: mockAnalysis.resumeSuggestions,
    generatedCoverLetter: mockAnalysis.generatedCoverLetter.Professional, // Save a default
  });

  if (!report) {
    throw new ApiError(500, "Failed to save the analysis report.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Analysis completed successfully."));
});

const getReportById = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const userId = req.user.uid;

    if (!reportId) {
        throw new ApiError(400, "Report ID is required.");
    }

    const report = await AnalysisReport.findById(reportId);

    if (!report) {
        throw new ApiError(404, "Report not found.");
    }

    if (report.userId.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to view this report.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, report, "Report fetched successfully."));
});

export { registerOrLoginUser, parseResume, analyzeContent, getReportById };