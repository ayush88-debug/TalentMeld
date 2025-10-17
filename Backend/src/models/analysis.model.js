import mongoose from "mongoose";

const analysisReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String, 
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: "Not Specified",
    },
    matchScore: {
      type: Number,
      required: true,
    },
    keywordAnalysis: {
      type: mongoose.Schema.Types.Mixed,
    },
    languageAnalysis: {
      type: mongoose.Schema.Types.Mixed,
    },
    resumeSuggestions: {
      type: mongoose.Schema.Types.Mixed,
    },
    generatedCoverLetter: {
      type: String,
    },
    originalResume: {
      type: String,
      required: true,
    },
    originalJobDescription: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const AnalysisReport = mongoose.model(
  "AnalysisReport",
  analysisReportSchema
);