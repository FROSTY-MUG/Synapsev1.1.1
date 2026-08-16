<div align="center">
<img width="1200" height="475" alt="Synapse OS" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Synapse OS (v1.1.1)

Synapse OS is a fully functional, AI-powered Web Operating System built on top of Next.js 15. It features a complete desktop environment, built-in productivity applications, and deep AI integrations powered by OpenRouter and Gemini 3.

## 🌟 Key Features

*   **Desktop Environment:** A rich, interactive Web OS shell featuring a Taskbar, App Drawer, window management, and MacOS-style Control Center.
*   **Integrated AI Assistant (Velyra):** A system-wide intelligent assistant capable of scheduling meetings, sending emails, running web searches, and querying internal company data.
*   **Built-in Applications:**
    *   **Google App:** Real-time web and image search powered by the Gemini 3 API.
    *   **Mail App:** Fully functional email client integrated with Nodemailer.
    *   **Dashboard & Analytics:** Real-time financial and data visualization widgets.
    *   **File Explorer & Notes:** Local file system management and markdown notes.
    *   **Terminal, Calendar, Calculator & More!**
*   **Knowledge Base (RAG):** Built-in Retrieval-Augmented Generation utilizing PostgreSQL vector storage for secure internal document indexing.

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   NPM or Yarn
*   A Gemini API Key (for Google Search and Voice Assistant fallback)
*   An OpenRouter API Key (for primary AI interactions)

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Skeletor-Pirate/Synapsev1.1.1.git
cd Synapsev1.1.1
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (or rename `.env.example` to `.env`) and configure the following variables. 

> **Important:** To deploy the app to Vercel/Netlify, make sure you add these variables to your deployment dashboard!

```env
# Primary AI Keys
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key

# Email Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Database / Other (Optional)
POSTGRES_URL=your_postgres_url
```

### 3. Run the Development Server

Start the application locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to enter the OS.

## ☁️ Deployment

Since Synapse OS utilizes **Next.js Server Actions** and **API Routes**, it cannot be deployed to static hosts like GitHub Pages. 

We highly recommend deploying to **Vercel**:
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add your Environment Variables.
4. Deploy!

## 🛠 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI/Animations:** Framer Motion & Lucide React
*   **AI Integrations:** OpenAI SDK, `@google/genai` (Gemini 3)
*   **Database:** Firebase & PostgreSQL (Vector)

---
*Built as a next-generation AI-native workspace.*
