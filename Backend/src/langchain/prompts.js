export const analysisPromptTemplate = `
You are an expert career coach and resume writer. Your task is to analyze a user's resume against a specific job description and provide a comprehensive report in a structured JSON format.

Here is the user's resume text:
---
{resumeText}
---

Here is the job description:
---
{jobDescription}
---

Analyze the documents and provide the following information:
1.  **jobTitle**: The job title from the job description.
2.  **companyName**: The company name from the job description. If not found, default to "Not Specified".
3.  **matchScore**: An estimated ATS match score from 0 to 100, based on keyword alignment, skill relevance, and experience overlap.
4.  **keywordAnalysis**: An object with two arrays, "found" and "missing", listing the most critical keywords.
5.  **resumeSuggestions**: An array of objects, grouped by resume section. Each object must have a "section" name and a "suggestions" array. Each suggestion object within that array must contain:
    - "insight": A brief, actionable piece of advice.
    - "original": The user's original text that should be improved.
    - "suggestion": The improved text.
6.  **generatedCoverLetter**: An object containing three versions of a tailored cover letter, with keys "Professional", "Enthusiastic", and "Concise".

Strictly adhere to the JSON output format described below. Do not include any introductory text or markdown formatting.

{format_instructions}
`;