📄 AI Resume Screener

<p align="center">
  <strong>AI-assisted resume-to-job matching with an auditable, multi-step screening pipeline.</strong><br/>
  Upload a resume, provide a job description, and get a structured match score, matching skills, missing skills, experience alignment, and a concise verdict.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge" alt="Gemini">
  <img src="https://img.shields.io/badge/Documents-PDF%20%7C%20DOCX-CC0000?style=for-the-badge" alt="Documents">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17">
</p>

🎯 What is AI Resume Screener?

AI Resume Screener is a full-stack application that compares a candidate's resume against a job description and turns the result into a structured hiring-style match report.

The frontend accepts .pdf and .docx resumes and a pasted job description. The backend extracts document content, sends it through a three-stage Gemini pipeline, and returns a structured result that the UI visualizes as a score and skill breakdown. citeturn771401view6turn868847view1

🧠 Screening Pipeline

The important part of the project is not simply "send resume to an LLM."

The backend uses a three-step pipeline:

┌──────────────────────────┐
│      Resume + JD         │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│  1. Extractor Agent      │
│  skills / exp / education│
│  strict JSON extraction  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│  2. Verifier Agent       │
│ cross-check extracted    │
│ skills against raw text  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│  3. Evaluator Agent      │
│ compare verified profile │
│ against job description  │
└─────────────┬────────────┘
              │
              ▼
      Structured Result

The extractor is instructed not to infer skills, the verifier removes unsupported skills, and the evaluator assigns a 0–100 score with matching skills, missing skills, experience status, and a verdict. citeturn868847view1

This is a deliberate anti-hallucination / evidence-first design.

✨ Key Features

📤 Resume Upload

The UI accepts:

.pdf
.docx

and validates the file type before submission. citeturn771401view6

🧾 Job Description Comparison

Users paste a job description alongside the resume for direct role-specific matching. citeturn771401view6

📊 Match Score

Results include an overall score out of 100 displayed using a visual score ring. citeturn771401view5

🧩 Skill Breakdown

The result separates:

Matching skills

Missing skills

Experience alignment

Overall verdict

The UI calculates a dedicated skills-match indicator and presents the matching/missing skill sets as chips. citeturn771401view5

🤖 Gemini Structured Output

The Gemini service requests JSON-formatted generation and the screening service maps the final JSON response into a typed DTO. citeturn868847view0turn868847view1

⚡ Asynchronous Screening

The main screening method is implemented with @Async and returns a CompletableFuture, allowing the screening operation to run asynchronously from the request-handling flow. citeturn868847view1

🛠️ Tech Stack

Layer

Technology

Frontend

React 19, Vite

Frontend HTTP

Axios

Backend

Java 17, Spring Boot 4.1

AI

Google Gemini

PDF parsing

Apache PDFBox 3

DOCX parsing

Apache POI 5

Persistence

Spring Data JPA

Databases

H2 / PostgreSQL support

HTTP

WebFlux / WebClient

JSON

Jackson

Build

Maven

The backend's dependency set includes PDFBox, Apache POI, Spring Data JPA, Spring WebMVC/WebFlux, PostgreSQL and Jackson. citeturn172478view2 The frontend is built with React 19, Axios, Vite and Oxlint. citeturn172478view3

📁 Project Structure

ai-resume-screener/
│
├── backend/
│   ├── src/main/java/com/resumescreener/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── BackendApplication.java
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── UploadForm.jsx
│   │   ├── ResultCard.jsx
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── README.md

The backend service layer currently contains dedicated Gemini, resume-parser, and resume-screening services, while the frontend separates upload and results presentation into components. citeturn776389view1turn510376view2

⚡ Run Locally

Backend

cd backend
./mvnw spring-boot:run

Windows:

mvnw.cmd spring-boot:run

Configure the Gemini API key:

gemini.api.key=YOUR_GEMINI_API_KEY

The application currently uses the gemini-flash-lite-latest model. citeturn868847view0

Frontend

cd frontend
npm install
npm run dev

Set the frontend API URL when needed:

VITE_API_URL=http://localhost:8080

🔄 Request Flow

Resume (.pdf/.docx)
        +
Job Description
        │
        ▼
   React Upload UI
        │
        ▼
POST /api/screen
        │
        ▼
 Document Parsing
        │
        ▼
Extractor Agent
        │
        ▼
Verifier Agent
        │
        ▼
Evaluator Agent
        │
        ▼
 MatchResultData
        │
        ▼
Score + Skill Breakdown + Verdict

The frontend submits the resume and job description as multipart form data to /api/screen. citeturn771401view6

🛡️ Why the Verification Stage Matters

LLM systems can produce plausible information that is not actually present in the source document.

This project intentionally inserts a separate verification step:

Raw resume
   ↓
Extraction
   ↓
Verification against raw text
   ↓
Only then → Job matching

That makes the final comparison more grounded in the candidate's actual resume text rather than unsupported model assumptions. The verifier is explicitly instructed to delete skills that are not found in the raw resume. citeturn868847view1

📊 Example Result

Candidate: Jane Doe

Overall Match: 84/100

Skills Match
██████████████████████░░░  84%

Experience Alignment
█████████████████████████  100%

Matching Skills
• Python
• SQL
• Machine Learning
• REST APIs

Missing Skills
• Kubernetes
• AWS

Verdict
Strong match with a few infrastructure skill gaps.

📸 Screenshots

Recommended assets:

docs/
├── upload-screen.png
├── processing.png
└── match-report.png

🔐 Security Notes

Never commit:

gemini.api.key
.env
personal resumes
private candidate data

Use environment variables or deployment secrets for API credentials.

🚀 Roadmap

Batch resume screening

Recruiter dashboard

Candidate ranking table

Job-description keyword extraction

Resume improvement suggestions

Skill-gap recommendations

Exportable screening reports

Authentication and role-based access

Audit trail for screening decisions

👨‍💻 Author

Anurag Singh

GitHub

<p align="center">
  ⭐ Star the repository if you find the screening architecture useful.
</p>
