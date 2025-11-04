# TalentMeld: AI-Powered ATS Resume Analyzer & Cover Letter Generator

<p align="center">
  <strong>Stop Guessing. Start Impressing.</strong>
  <br />
  TalentMeld is an intelligent AI platform that scores your resume against any job description, provides actionable feedback to beat Applicant Tracking Systems (ATS), and generates perfectly tailored cover letters in seconds.
</p>

<p align="center">
  <a href="https://talent-meld.vercel.app/"><strong>View Live Demo »</strong></a>
</p>

<div align="center">
  <img src="Frontend\public\TalentMeld.jpeg" alt="TalentMeld Application Demo" width="800"/>
</div>

<br />

## ## About The Project

Tired of sending applications into the void? TalentMeld is a full-stack, AI-powered web application designed to help job seekers optimize their resumes and cover letters for the modern, automated hiring landscape.

By leveraging the power of large language models via LangChain and the Groq API, TalentMeld performs a deep, analytical review of a user's resume against a specific job description. It goes beyond simple keyword matching to provide a realistic **ATS Match Score**, a detailed **Keyword Analysis**, and a **Language & Tone Evaluation**.

The core feature is its actionable feedback engine, which provides section-by-section suggestions to reframe and quantify existing experience, ensuring your achievements are highlighted effectively. The platform also includes an on-demand **AI Cover Letter Generator** that creates concise, professional, and tone-specific letters, helping you craft the perfect application every time.

<div align="center">
  <img src="Frontend\public\Steps.png" alt="TalentMeld Application Demo" width="800"/>
</div>

---

## ## Key Features

-   **✨ Intelligent ATS Match Score:** Get a realistic score (0-100) based on a weighted analysis of keywords, skill relevance, and experience alignment.
-   **💡 Actionable Resume Suggestions:** Receive section-by-section feedback with concrete, copy-paste ready suggestions to improve the impact and clarity of your resume.
-   **🔑 Comprehensive Keyword Analysis:** Visualize which critical keywords from the job description are present in your resume and, more importantly, which ones are missing.
-   **✍️ Language & Tone Evaluation:** Ensure your resume is professional and error-free with an AI-powered grammar score and specific grammatical improvement points.
-   **📄 On-Demand Cover Letter Generation:** Instantly generate a concise, professional cover letter and regenerate new versions with different tones ("Enthusiastic," "Concise," etc.) with a single click.
-   **🔒 Secure Authentication:** Seamless and secure user login and session management powered by Firebase Authentication.
-   ** responsive design:** A polished, fully responsive UI that works beautifully on desktops, tablets, and mobile devices.

---

## ## Technology Stack

This project is built with a modern, full-stack architecture:

-   **Frontend:**
    -   **Framework:** React (with Vite)
    -   **State Management:** Redux Toolkit
    -   **Styling:** Tailwind CSS, shadcn/ui
    -   **Animations:** Framer Motion
    -   **Routing:** React Router DOM
-   **Backend:**
    -   **Framework:** Node.js, Express.js
    -   **Database:** MongoDB with Mongoose
    -   **AI Integration:** LangChain.js with the Groq API (for openai/gpt-oss-120b)
-   **Authentication:** Firebase Authentication
-   **Deployment:**
    -   Frontend deployed on **Vercel**.
    -   Backend deployed on **Render**.

---

## ## Getting Started

To get a local copy up and running, follow these simple steps.

### ### Prerequisites

Make sure you have Node.js and npm installed on your machine.

-   npm
    ```sh
    npm install npm@latest -g
    ```

### ### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/talentmeld.git
    ```

2.  **Backend Setup**
    -   Navigate to the `Backend` directory:
        ```sh
        cd Backend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Create a `.env` file in the `Backend` root and add the following variables (use `.env.sample` as a guide):
        ```env
        PORT=8000
        MONGODB_URL="your_mongodb_connection_string"
        CORS_ORIGIN="http://localhost:5173"
        GROQ_API_KEY="your_groq_api_key"
        FIREBASE_SERVICE_ACCOUNT_KEY={...your_firebase_service_account_json...}
        ```
    -   Start the backend server:
        ```sh
        npm run dev
        ```

3.  **Frontend Setup**
    -   Navigate to the `Frontend` directory:
        ```sh
        cd ../Frontend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Create a `.env` file in the `Frontend` root and add your Firebase client-side keys:
        ```env
        VITE_FIREBASE_API_KEY="your_firebase_api_key"
        VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
        VITE_FIREBASE_PROJECT_ID="your_project_id"
        VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
        VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
        VITE_FIREBASE_APP_ID="your_app_id"
        ```
    -   Create a `.env.local` file in the `Frontend` root for the development proxy:
        ```env
        VITE_BACKEND_URL=http://localhost:8000
        ```
    -   Start the frontend development server:
        ```sh
        npm run dev
        ```

Your application should now be running locally, with the frontend at `http://localhost:5173`.