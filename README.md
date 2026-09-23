# SkillBridge AI

An AI-powered interview prep tool that analyzes a resume against a job description, generates a structured interview report (match score, likely technical & behavioral questions, skill gaps, and a day-wise preparation roadmap), and can generate a tailored, job-specific resume as a downloadable PDF.

Built with the MERN stack + Google Gemini for structured AI generation.

---

## Features

- **Resume vs Job Description matching** — upload a resume (PDF) or write a self description, paste a job description, and get an AI-generated match score
- **AI-generated interview questions** — technical and behavioral questions tailored to the specific role and resume, not generic templates
- **Skill gap analysis** — highlights what's missing between the candidate's profile and the job requirements
- **Day-wise preparation roadmap** — a structured plan to close the identified gaps before the interview
- **Tailored resume generation** — regenerates a resume aligned to the job description and exports it as a PDF
- **Authentication** — JWT-based auth with hashed passwords and a token blacklist on logout (so a logged-out token can't be reused)
- **Interview history** — logged-in users can view all their past interview reports

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Axios
- SASS

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Google Gemini API (`@google/genai`) — structured JSON output via `responseSchema`, so the AI's response is always parseable, never free-form text
- `pdf-parse` — extracts text from uploaded resume PDFs
- Puppeteer — renders AI-generated HTML into a downloadable PDF resume
- JWT + bcrypt — authentication
- Multer — file upload handling
- Zod — request validation

---

## How It Works

1. **User submits** a resume (PDF) and/or self description, plus a job description
2. **Backend** verifies the JWT, validates the input, and extracts text from the resume PDF
3. **Gemini API** receives the resume text + job description in a prompt with a strict JSON schema, and returns a structured report (score, questions, skill gaps, roadmap)
4. **MongoDB** saves the report against the logged-in user
5. **Frontend** displays the score, questions, and roadmap in tabs

For the resume PDF feature: the saved report is re-sent to Gemini with a different prompt that asks for tailored resume HTML, which Puppeteer then converts into a downloadable PDF.

---

## Error Handling & Validation

Earlier versions of the backend had no error handling — an unexpected failure (a malformed request, a missing file, a Gemini API timeout) could crash a request or return a raw, unhandled error to the client. This was reworked to:

- **`catchAsync` wrapper** — every async controller is wrapped so any rejected promise (Gemini API failure, PDF parsing failure, database error) is automatically forwarded to Express's error handler, instead of crashing the process or hanging the request
- **`AppError` class** — a custom error type that carries an HTTP status code and a safe, user-facing message, thrown wherever the app hits an expected failure case (e.g. "Interview report not found", 404)
- **Centralized error middleware** — one place (`middlewares/error.middleware.js`) that turns every error into a consistent `{ message: "..." }` JSON response, converts Mongoose `CastError`s (bad IDs) and Multer upload errors into clean 400s, and hides internal error details from the client on unexpected 500s
- **Zod request validation** — the interview report route validates `jobDescription` (required, length-checked) and that either a resume file or a self description was provided, **before** the request reaches the paid Gemini API call — so invalid requests fail fast and don't waste an API call
- A couple of real bugs were caught and fixed in the process: a typo'd `Content-Dispostion` header (was silently breaking the PDF download filename) and an incorrect `findById({ _id: ... })` call

---

## Getting Started

### Prerequisites
- Node.js
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key

### Backend setup
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:
```bash
npm run dev
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## API Routes

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in, sets JWT cookie | Public |
| POST | `/api/auth/logout` | Log out, blacklists the current token | Private |
| POST | `/api/interview/` | Generate an interview report from resume + job description | Private |
| GET | `/api/interview/` | Get all interview reports for the logged-in user | Private |
| GET | `/api/interview/report/:interviewId` | Get a single interview report by ID | Private |
| POST | `/api/interview/resume/pdf/:interviewId` | Generate and download a tailored resume PDF | Private |

---

## Project Structure

```
skillbridge-ai/
├── Backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/       # Gemini API integration
│       ├── models/
│       ├── middlewares/    # auth, file upload, error handling
│       ├── validators/     # zod request validation
│       ├── utils/          # AppError, catchAsync
│       └── app.js
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   └── interview/
        └── App.jsx
```

---

## Possible Future Improvements

- Redis caching for repeated resume + job description submissions, to avoid duplicate Gemini API calls
- Rate limiting on the interview generation endpoint
- Automated tests for controllers and validators

---

## Author

Built by Amit — feel free to reach out or open an issue for questions/suggestions.
