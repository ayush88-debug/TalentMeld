import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import admin from "../firebase/config.js";
import { User } from "../models/user.model.js";
import { AnalysisReport } from "../models/analysis.model.js"; 
import {PDFParse} from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { analysisParser } from "../langchain/parsers.js";
import { analysisPromptTemplate } from "../langchain/prompts.js";
import { OutputFixingParser } from "langchain/output_parsers";

// This function now only ensures the user exists in your database after they log in on the client.
const loginOrRegisterUser = asyncHandler(async (req, res) => {
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
            email,
            name,
            avatar: picture || "",
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User verified successfully"));
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
      const result = await mammoth.extractRawText({ path: resumeLocalPath });
      text = result.value;
    } else {
      throw new ApiError(
        400,
        "Unsupported file type. Please upload a PDF or DOCX file."
      );
    }

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

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b", 
    temperature: 0.2, 
  });
  
  const prompt = new PromptTemplate({
    template: analysisPromptTemplate,
    inputVariables: ["resumeText", "jobDescription"],
    partialVariables: {
      format_instructions: analysisParser.getFormatInstructions(),
    },
  });

  const chain = prompt.pipe(llm).pipe(analysisParser);

  let analysisResult;
  try {
    analysisResult = await chain.invoke({
      resumeText: resumeText,
      jobDescription: jobDescription,
    });
  } catch (error) {
    console.error("LangChain analysis failed:", error);
    throw new ApiError(500, "The AI failed to generate a valid analysis. Please try again.");
  }

  const professionalCoverLetter = analysisResult.generatedCoverLetter?.Professional || "Could not generate a professional cover letter.";

  const report = await AnalysisReport.create({
    userId,
    jobTitle: analysisResult.jobTitle,
    companyName: analysisResult.companyName,
    matchScore: analysisResult.matchScore,
    keywordAnalysis: analysisResult.keywordAnalysis,
    resumeSuggestions: analysisResult.resumeSuggestions,
    generatedCoverLetter: professionalCoverLetter,
  });

  if (!report) {
    throw new ApiError(500, "Failed to save the analysis report.");
  }

  const responseData = {
    ...report.toObject(),
    generatedCoverLetter: analysisResult.generatedCoverLetter,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Analysis completed successfully."));
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

    if (report.userId !== userId) {
        throw new ApiError(403, "You are not authorized to view this report.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, report, "Report fetched successfully."));
});


const getUserReports = asyncHandler(async (req, res) => {
  const userId = req.user.uid; 

  const reports = await AnalysisReport.find({ userId }).sort({ createdAt: -1 });

  if (!reports) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No reports found for this user."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "User reports fetched successfully."));
});

export { loginOrRegisterUser, parseResume, analyzeContent, getReportById, getUserReports };
