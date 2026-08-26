const resume = `
Amit Singh
Kanpur, Uttar Pradesh, India

Email: amitsingh@example.com
Phone: +91 9876543210

LinkedIn: https://linkedin.com/in/amitsingh
GitHub: https://github.com/amitsingh

Professional Summary:
Passionate Full Stack Developer with experience in MERN Stack development.
Strong understanding of Java, Data Structures & Algorithms, REST APIs,
MongoDB, and modern web technologies. Interested in building scalable
web applications and AI-powered solutions.

Technical Skills:
- Languages: Java, JavaScript
- Frontend: React.js, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express.js
- Databases: MongoDB, MySQL
- Tools: Git, GitHub, Docker, VS Code

Projects:

1. NexMeet
   - Real-time video conferencing application.
   - Built using React, Node.js, Socket.io, and WebRTC.
   - Features include video calls, chat, and meeting rooms.

2. AI Resume Analyzer
   - AI-powered platform for resume analysis and skill-gap detection.
   - Generates ATS score, interview questions, and learning roadmaps.
   - Built using MERN Stack and Gemini API.

Education:
Bachelor of Technology (Information Technology)
SCRIET, CCS University
Expected Graduation: 2028

Experience:
Full Stack Developer Intern
XYZ Technologies
June 2026 - August 2026

Responsibilities:
- Developed REST APIs using Express.js.
- Built responsive React applications.
- Integrated MongoDB for data storage.

Certifications:
- Java Programming
- MERN Stack Development
- Git & GitHub Essentials

Achievements:
- Solved 300+ DSA problems.
- Built multiple full-stack projects.
- Active open-source contributor.

Languages:
- English
- Hindi
`;

const jobDescription = `
Role: Full Stack Developer Intern

Requirements:
- Strong knowledge of JavaScript and React.js
- Experience with Node.js and Express.js
- Knowledge of MongoDB
- Understanding of REST APIs
- Familiarity with Docker and AWS
- Good problem-solving skills
`;

const selfDescription = `
I am a second-year B.Tech IT student passionate about software development.
I have experience building MERN Stack applications and solving DSA problems
in Java. I am looking for internship opportunities to improve my development
and problem-solving skills.
`;

module.exports = { resume, jobDescription, selfDescription };

// {
//   candidate_name: 'Amit Singh',
//   applied_role: 'Full Stack Developer Intern',
//   overall_match_score: '85%',
//   summary: 'Strong candidate with a solid foundation in the MERN stack, WebRTC, and Java-based Data Structures & Algorithms. Meets almost all key technical requirements for the Full Stack Developer Intern role.',
//   skill_analysis: [
//     'JavaScript',
//     'React.js',
//     'Node.js',
//     'Express.js',
//     'MongoDB',
//     'REST APIs',
//     'Docker',
//     'Git'
//   ],
//   missing_or_weak_skills: [ 'AWS' ],
//   strengths: [
//     'Hands-on experience with real-time applications using Socket.io and WebRTC, as well as AI API integrations.',
//     'Strong problem-solving background with over 300 DSA problems solved in Java.',
//     'Prior intern experience developing REST APIs and responsive frontend applications.'
//   ],
//   areas_of_improvement: [
//     'Lacks stated experience with cloud platforms like AWS mentioned in the job description.',
//     'Needs deeper exposure to production-grade Docker deployment strategies.'
//   ],
//   suggested_interview_questions: [
//     'How did you handle state management and peer-to-peer connection establishment in NexMeet using WebRTC and Socket.io?',
//     'Can you explain how you integrated the Gemini API in the AI Resume Analyzer project and structured the REST backend?',
//     'How would you optimize a MongoDB aggregation pipeline for high-traffic web applications?',
//     'How do you containerize a full-stack MERN application using Docker?'
//   ],
//   final_recommendation: 'Highly Recommended for Interview'
// }

// {
//   matchScore: 88,
//   technicalQuestions: [
//     {
//       question: 'How did you handle WebSockets and WebRTC signaling in your NexMeet video conferencing project?',
//       intention: 'Assess deep understanding of real-time communication protocols and architecture.',
//       answer: 'In NexMeet, Socket.io is used as a signaling server to exchange session descriptions (SDP offers/answers) and ICE candidates between peers. Once signaling is complete, a direct WebRTC peer-to-peer connection is established for streaming audio and video.'
//     },
//     {
//       question: 'How do Express.js middlewares work and how do you handle centralized error management in a REST API?',
//       intention: 'Evaluate backend architecture design skills in Express.js.',
//       answer: 'Express middlewares are functions executed in the request-response cycle that access req, res, and next. Centralized error handling is achieved by defining a custom middleware with four parameters (err, req, res, next) at the end of the middleware stack.'
//     },
//     {
//       question: 'Can you explain how MongoDB indexes improve query performance and when they might incur overhead?',
//       intention: 'Verify database performance optimization knowledge.',
//       answer: 'MongoDB indexes create data structures (B-Trees) that store a small portion of the dataset in an easy-to-traverse form, speeding up query execution. However, they add write overhead because indexes must be updated whenever documents are inserted, updated, or deleted.'
//     }
//   ],
//   behavioralQuestions: [
//     {
//       question: 'Can you describe a challenging bug you encountered in your NexMeet project and how you solved it?',
//       intention: 'Evaluate problem-solving ability and debugging process under pressure.',
//       answer: 'While building NexMeet, peer connection drops occurred during network switches. I debugged the issue by monitoring WebRTC connection states, re-triggering ICE candidate generation, and fallback handling via TURN servers to ensure smooth reconnects.'
//     },
//     {
//       question: 'How do you prioritize learning DSA, building full-stack projects, and maintaining your academic grades?',
//       intention: 'Check time management and dedication to continuous learning.',
//       answer: 'I structure my day with dedicated time blocks: mornings for DSA practice, afternoons/evenings for B.Tech coursework, and late afternoons or weekends for project development and internship tasks.'
//     }
//   ],
//   skillGaps: [
//     {
//       skills: 'Cloud Services (AWS Deployment, S3, EC2)',
//       severity: 'medium'
//     },
//     {
//       skills: 'Advanced Container Orchestration with Docker',
//       severity: 'low'
//     }
//   ],
//   preparationPlan: [
//     { day: 1, focus: 'AWS & Cloud Deployment Basics', tasks: [Array] },
//     { day: 2, focus: 'Docker Containerization', tasks: [Array] },
//     {
//       day: 3,
//       focus: 'Advanced Backend & Database Design',
//       tasks: [Array]
//     },
//     {
//       day: 4,
//       focus: 'Mock Interview & Behavioral Review',
//       tasks: [Array]
//     }
//   ]
// }
