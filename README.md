# 🏥 HealthIQ — AI Powered Health Intelligence Platform

<div align="center">

![HealthIQ](https://img.shields.io/badge/AI-Healthcare-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge\&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge\&logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge\&logo=prisma)
![Google AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge)

### 🧠 Transform Medical Reports Into Actionable Health Insights

HealthIQ is an AI-powered health intelligence platform that helps users upload medical reports, extract health metrics, analyze trends, generate personalized insights, and better understand their health through AI-driven recommendations.

</div>

---

# ✨ Features

## 📄 Medical Report Management

* Upload blood reports, prescriptions, and health documents
* Store uploaded documents securely using Cloudinary
* Process medical reports using AI
* Extract important health metrics from uploaded reports
* Categorize health documents for easier tracking

## 🤖 AI-Powered Health Analysis

* Generate AI-based health summaries
* Explain medical report values in simple language
* Detect abnormal health indicators
* Provide personalized health recommendations
* Help users understand long-term health patterns

## 📊 Health Metrics Tracking

* Track biomarkers and health values over time
* View historical health records
* Monitor abnormal metric trends
* Organize health data in a centralized dashboard
* Support preventive healthcare decision-making

## 🎯 Health Intelligence Dashboard

* Personalized health overview
* Health score system
* Recent uploaded reports
* Key health statistics
* AI-generated insights and recommendations

## 🔐 Authentication & Security

* Google authentication using NextAuth.js
* Secure session management
* Protected dashboard routes
* User-specific medical records
* Environment-based secret management

---

# 🛠️ Tech Stack

## Frontend

* Next.js 16
* React.js
* TypeScript
* Tailwind CSS
* Shadcn UI

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL
* Neon Database

## Authentication

* NextAuth.js
* Google OAuth

## AI & Cloud Services

* Google Gemini AI
* Cloudinary
* AI Document Processing

---

# 📂 Project Structure

```bash
HealthIQ/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   └── auth/
│   │
│   ├── components/
│   │
│   ├── lib/
│   │
│   ├── generated/
│   │
│   └── types/
│
├── prisma/
│
├── public/
│   └── screenshots/
│
└── README.md
```

---

# 🚀 Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/shahid-shaikh-001/HealthIQ.git
cd HealthIQ
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

DATABASE_URL=
DIRECT_URL=
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run Database Migrations

```bash
npx prisma migrate dev
```

## 6. Start Development Server

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

---

# 🌐 Live Demo

## 🚀 Live Website

https://health-iq-theta.vercel.app

## 📦 GitHub Repository

https://github.com/shahid-shaikh-001/HealthIQ

---

# 📊 Core Modules

## Document Processing Engine

* Medical report upload
* AI text extraction
* Report classification
* Medical data parsing
* Document processing status tracking

## Health Analytics Engine

* Health metric tracking
* Trend analysis
* Health score generation
* Abnormal value detection
* Preventive health monitoring

## AI Intelligence Layer

* Gemini AI integration
* Report summarization
* Health recommendations
* Risk insights
* Simple medical explanations

## User Dashboard

* Health overview
* Recent reports
* Trends and insights
* Health score details
* Profile management

---

# 📸 Screenshots

<img src="https://raw.githubusercontent.com/shahid-shaikh-001/HealthIQ/main/public/dashboard.png" alt="HealthIQ Dashboard" width="100%" />

<br />

<img src="https://raw.githubusercontent.com/shahid-shaikh-001/HealthIQ/main/public/upload.png" alt="Upload Medical Report" width="100%" />

<br />

<img src="https://raw.githubusercontent.com/shahid-shaikh-001/HealthIQ/main/public/health-score.png" alt="Health Score Page" width="100%" />

<br />

<img src="https://raw.githubusercontent.com/shahid-shaikh-001/HealthIQ/main/public/insights.png" alt="Health Insights Page" width="100%" />

---

# 📈 Project Highlights

* AI-powered medical report analysis
* Health intelligence dashboard
* Google authentication with NextAuth.js
* Cloudinary document upload integration
* PostgreSQL database with Prisma ORM
* Type-safe full-stack development
* Modern Next.js App Router architecture
* Scalable and production-focused project structure

---

# 🎯 Future Improvements

* Wearable device integration
* Health risk prediction models
* Doctor consultation support
* Medication reminders
* AI nutrition recommendations
* Smart health notifications
* Family health profiles
* Advanced analytics dashboard
* Retry logic for AI processing failures

---

# 👨‍💻 Author

## Shahid Shaikh

GitHub: https://github.com/shahid-shaikh-001

---

# ⭐ Support

If you found this project useful, give it a star and support its development.

---

# 📜 License

This project is licensed under the MIT License.
