# SkillBridge AI

An AI-powered interview preparation platform. Give it a job description and your resume (or a short self-description) and it generates a personalized interview plan: a match score, likely technical and behavioral questions with model answers, a skill gap analysis, and a day-wise preparation roadmap. It can also generate a resume tailored to the job and export it as an ATS-friendly PDF.

Built with the MERN stack, Redis, and the Google Gemini API.

**Live demo:** https://skillbridge-ai-frontend.netlify.app

---

## Screenshots

**Create an interview plan**

![Home page](frontend/public/Screenshot%202026-08-10%20194045.png)

**Interview report: questions, match score and skill gaps**

![Interview report](frontend/public/Screenshot%202026-08-11%20000013.png)

---

## Features

- **Resume vs job description analysis**: upload a resume (PDF) or write a short self-description, paste the job description, and get a match score from 0 to 100.
- **Role-specific interview questions**: technical and behavioral questions generated for the specific job and candidate, each with the interviewer's intention and a model answer.
- **Skill gap analysis**: missing skills are listed with a severity level (low, medium, high).
- **Day-wise preparation roadmap**: a structured plan with a focus area and tasks for each day.
- **Tailored resume PDF**: generates a job-specific, ATS-friendly resume and downloads it as a PDF.
- **Interview history**: logged-in users can reopen any of their past reports.
- **Secure authentication**: JWT in an httpOnly cookie, bcrypt password hashing, and a token blacklist on logout.

---

## Tech Stack

**Frontend**
- React 19 and Vite
- React Router 7
- Axios
- SASS

**Backend**
- Node.js and Express 5
- MongoDB and Mongoose
- Redis (response caching)
- Google Gemini API (`@google/genai`) with a JSON `responseSchema`, so AI output is always structured and parseable
- `pdf-parse` to extract text from uploaded resumes
- Puppeteer to render AI-generated HTML into a PDF
- JWT, bcryptjs and cookie-parser for authentication
- Multer (in-memory uploads), Zod (validation), express-rate-limit

---

## How It Works

1. The user submits a job description plus a resume PDF and/or a self-description.
2. The backend checks the JWT, applies the rate limiter, validates the input with Zod, and extracts text from the PDF.
3. A cache key is built as a SHA-256 hash of the resume text, self-description and job description. If Redis already has a report for that key, it is reused. Otherwise the inputs go to Gemini with a strict JSON schema and the result is cached for 24 hours.
4. The report is saved in MongoDB under the logged-in user.
5. The frontend shows the questions, roadmap, match score and skill gaps in a single report view.

For the resume PDF, the saved report data is sent to Gemini with a different prompt that returns tailored resume HTML, and Puppeteer converts that HTML into an A4 PDF.

Redis is optional at runtime. If it is down or not configured, the app logs the error and calls Gemini directly.

---

## Reliability and Security

- **Redis caching**: identical submissions within 24 hours skip the paid Gemini call.
- **Rate limiting**: report generation and resume PDF generation are limited to 5 requests per 15 minutes per user.
- **Validation before AI calls**: the job description (20 to 5000 characters), self-description (up to 2000 characters), and the "resume or self-description" rule are checked before any PDF parsing or Gemini request. Resume uploads are limited to 3 MB.
- **Centralized error handling**: a `catchAsync` wrapper forwards async errors to one error middleware. A custom `AppError` class carries status codes, and invalid Mongo IDs and upload errors become clean 400 responses. Internal error details are never leaked on 500s.
- **Authentication**: passwords are hashed with bcrypt, tokens expire after 1 day, and logout blacklists the token so it cannot be reused.
- **Data isolation**: reports are always queried by both report ID and the logged-in user's ID, so users can only access their own data.
- **CORS**: restricted to the deployed frontend origin with credentials enabled.

---

## Getting Started

### Prerequisites

- Node.js
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key
- Redis (optional, for caching)

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379   # optional, this is the default
```

Run it:

```bash
npm run dev
```

The server listens on `PORT`, or 3000 if it is not set.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run it:

```bash
npm run dev
```

> **Local development note:** the backend sets the auth cookie with `secure: true` and `sameSite: "none"`, and CORS allows only the deployed frontend origin. To run everything locally, update the `origin` in `Backend/src/app.js` to your local frontend URL and serve over HTTPS (or relax the cookie options for development).

---

## API Reference

| Method | Route | Description | Auth |
| ------ | ----- | ----------- | ---- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and set the JWT cookie | Public |
| GET | `/api/auth/logout` | Log out and blacklist the current token | Public |
| GET | `/api/auth/get-me` | Get the logged-in user's details | Private |
| POST | `/api/interview/` | Generate an interview report (`multipart/form-data`: `jobDescription`, `selfDescription`, `resume`) | Private |
| GET | `/api/interview/` | List all reports for the logged-in user | Private |
| GET | `/api/interview/report/:interviewId` | Get a single report | Private |
| POST | `/api/interview/resume/pdf/:interviewId` | Generate and download a tailored resume PDF | Private |

---

## Project Structure

```
SkillBridge-AI/
├── Backend/
│   ├── server.js              # entry point: DB + Redis connection, server start
│   └── src/
│       ├── app.js             # Express app, CORS, routes, error handler
│       ├── config/            # database.js, redis.js
│       ├── controllers/       # auth and interview controllers
│       ├── middlewares/       # auth, file upload, rate limiter, error handler
│       ├── models/            # user, interviewReport, blacklist
│       ├── routes/            # auth and interview routes
│       ├── services/          # Gemini integration and PDF generation
│       ├── utils/             # AppError, catchAsync, cache key builder
│       └── validator/         # Zod request validation
└── frontend/
    └── src/
        ├── app.routes.jsx     # routes, protected pages
        └── features/
            ├── auth/          # login, register, auth context and hooks
            └── interview/     # home, report page, API service, context
```

---

## Possible Improvements

- Automated tests for controllers, validators and middleware
- A Redis-backed store for the rate limiter so limits are shared across server instances
- DOCX resume support (currently PDF only)
- A TTL index on the token blacklist so expired tokens are cleaned up automatically

---

## Author

Built by [Amit](https://github.com/amit6022). Feel free to open an issue for questions or suggestions.
