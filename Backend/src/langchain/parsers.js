import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

//schema for a single resume suggestion
const suggestionSchema = z.object({
  insight: z.string().describe("Brief, actionable advice for the user."),
  original: z.string().describe("The user's original text from their resume."),
  suggestion: z.string().describe("The improved version of the text."),
});

//schema for a section of suggestions
const sectionSchema = z.object({
  section: z.string().describe("The name of the resume section (e.g., 'Work Experience')."),
  suggestions: z.array(suggestionSchema).describe("A list of suggestions for this section."),
});

//main schema for the entire analysis report
export const analysisParser = StructuredOutputParser.fromZodSchema(
  z.object({
    jobTitle: z.string().describe("The job title from the job description."),
    companyName: z.string().describe("The company name from the job description. Default to 'Not Specified' if not found."),
    matchScore: z.number().describe("An estimated ATS match score from 0 to 100."),
    keywordAnalysis: z.object({
      found: z.array(z.string()).describe("List of critical keywords found in the resume."),
      missing: z.array(z.string()).describe("List of critical keywords missing from the resume."),
    }).describe("Analysis of keyword alignment."),
    resumeSuggestions: z.array(sectionSchema).describe("An array of suggestion objects, grouped by resume section."),
    generatedCoverLetter: z.object({
        Professional: z.string().describe("A cover letter with a professional tone."),
        Enthusiastic: z.string().describe("A cover letter with an enthusiastic tone."),
        Concise: z.string().describe("A cover letter with a concise tone."),
    }).describe("Three versions of a tailored cover letter.")
  })
);