import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// Sub-schema for a single, specific resume suggestion
const suggestionSchema = z.object({
  insight: z.string().describe("A brief, actionable piece of advice explaining WHY the change is needed (e.g., 'Quantify impact with metrics')."),
  original: z.string().describe("The user's original text from their resume that should be improved."),
  suggestion: z.string().describe("The improved, rephrased version of the text. **This string MUST preserve the original formatting, including bullet points and newlines (use '\\n').**"),
});

// Sub-schema for a group of suggestions for one resume section
const sectionSchema = z.object({
  section: z.string().describe("The name of the resume section being analyzed (e.g., 'Work Experience', 'Projects')."),
  suggestions: z.array(suggestionSchema).describe("A list of suggestions for this specific section."),
});

// The main schema for the entire analysis report
export const analysisParser = StructuredOutputParser.fromZodSchema(
  z.object({
    jobTitle: z.string().describe("The job title from the job description."),
    companyName: z.string().describe("The company name from the job description. Default to 'Not Specified' if not found."),
    matchScore: z.number().int().min(0).max(100).describe("An estimated ATS match score from 0 to 100."),
    keywordAnalysis: z.object({
      found: z.array(z.string()).describe("List of critical keywords from the job description that were found in the resume."),
      missing: z.array(z.string()).describe("List of critical keywords from the job description that are missing from the resume, which the user might want to add if they have relevant experience."),
    }).describe("Analysis of keyword alignment."),
    
    languageAnalysis: z.object({
        score: z.number().int().min(0).max(100).describe("A score from 0 to 100 evaluating the overall language, grammar, and professionalism."),
        overallFeedback: z.string().describe("A one-sentence summary of the language and tone analysis."),
        improvements: z.array(z.string()).describe("A list of 2-3 specific, actionable bullet points for improvement (e.g., 'Use more active voice', 'Eliminate redundant words').")
    }).describe("Analysis of the resume's language, grammar, and professional tone."),

    resumeSuggestions: z.array(sectionSchema).describe("An array of suggestion objects, grouped by resume section. Focus on improving the existing content."),
    
    generatedCoverLetter: z.object({
        Professional: z.string().describe("A tailored cover letter with a professional and formal tone."),
        Enthusiastic: z.string().describe("A tailored cover letter with an energetic and enthusiastic tone."),
        Concise: z.string().describe("A brief and to-the-point tailored cover letter."),
    }).describe("Three versions of a tailored cover letter based on the resume and job description.")
  })
);
