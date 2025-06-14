# 🧑‍💼 Full Stack Job Portal Website - Insider Jobs

A fully functional **Job Listing and Job Searching platform** built with the **MERN stack** (MongoDB, Express, React, Node.js). This platform enables **job seekers** to search and apply for job openings and allows **recruiters** to manage job posts and applications.

---

## 🚀 Features

### 👨‍💻 Job Seekers
- 🔍 Search for job openings by title, location, or category
- 📝 Apply to jobs directly from the portal
- 📂 Upload and manage resume on user profile
- 🔐 User Authentication via [Clerk](https://clerk.dev)

### 🧑‍💼 Recruiters Dashboard
- ➕ Post new job listings
- 📋 View and manage existing job posts
- ✅ Accept or ❌ Reject job applications
- 👁️‍🗨️ View applicants' resumes

### ⚙️ System Integrations
- 📊 **Sentry** for:
  - Real-time error tracking
  - Performance monitoring
  - MongoDB query tracing for performance optimization

### 🌐 Deployment
- ✅ Deployed on [Vercel](https://vercel.com)

---

## 🧰 Tech Stack

| Tech | Description |
|------|-------------|
| **Frontend** | React, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | Clerk |
| **Monitoring** | Sentry |
| **Deployment** | Vercel |

---

## 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   https://github.com/vmrakshe/Job_Portal_App---Insider-Job.git
   cd Job_Portal_App---Insider-Job
   
2. **Install Dependencies**
   ```bash
   # For both frontend and backend
   npm install
   
3. **Set Environment Variables**
   - Create a ```.env ``` file in the client and server directory and add required env variable

4. **Run the App Locally**
   ```bash
   # For frontend 
   cd client
   npm start dev

   # For backend 
   cd server
   npm run server
   

