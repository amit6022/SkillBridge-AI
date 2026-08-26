const { GoogleGenAI } = require("@google/genai");
// const z = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// const interviewReportSchema = z.object({
//   matchScore: z
//     .number()
//     .describe(
//       "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
//     ),

//   technicalQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be ask in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe("How to answer this question, what points to take etc."),
//       }),
//     )
//     .describe(
//       "Technical question that can be asked in the interview along with their intention and how to answer them",
//     ),

//   behavioralQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be ask in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe("How to answer this question, what points to take etc."),
//       }),
//     )
//     .describe(
//       "Technical question that can be asked in the interview along with their intention and how to answer them",
//     ),

//   skillGaps: z
//     .array(
//       z.object({
//         skills: z.string().describe("The skill which the candidate is lacking"),
//         severity: z
//           .enum(["low", "medium", "high"])
//           .describe(
//             "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
//           ),
//       }),
//     )
//     .describe(
//       "List of skills gaps in the candidate's profile along with their severity",
//     ),

//   preparationPlan: z
//     .array(
//       z.object({
//         day: z
//           .number()
//           .describe("The day number in the preparation plan, starting from 1"),
//         focus: z
//           .string()
//           .describe(
//             "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
//           ),
//         tasks: z
//           .array(z.string())
//           .describe(
//             "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
//           ),
//       }),
//     )
//     .describe(
//       "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
//     ),
// });

const responseSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "The title of the job for which the interview report is generated",
    },

    matchScore: {
      type: "number",
    },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skills: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skills", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  //   const prompt = `
  // Generate an interview report for a candidate with the following details:
  //                         Resume: ${resume}
  //                         Self Description: ${selfDescription}
  //                         Job Description: ${jobDescription}`;

  const prompt = `
Generate an interview report.

Return ONLY JSON matching the provided schema.

Do not create fields such as:
candidate_name,
summary,
strengths,
areas_for_improvement,
skills_assessment,
suggested_interview_questions.

Use only:
matchScore,
technicalQuestions,
behavioralQuestions,
skillGaps,
preparationPlan.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Saves the PDF to hn.pdf.
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "The HTML of the resume which will be converted to PDF using puppeteer",
      },
    },
    required: ["html"],
  };

  const prompt = `Generate resume for a candidate with the following details:
   Resume: ${resume}
   Self Description: ${selfDescription}
   Job Description: ${jobDescription}
  
   the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
   The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
   The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
   you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
   The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
   The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
   `;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfSchema,
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pfdBuffer = await generatePdfFromHtml(jsonContent.html);

  return pfdBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
