# Nexus AI – Autonomous IT Co-Manager

**Live Demo:** [https://studio--studio-3440234901-47972.us-central1.hosted.app/dashboard](https://studio--studio-3440234901-47972.us-central1.hosted.app/dashboard)

**Project Report:** [PROJECT_REPORT.md](PROJECT_REPORT.md) - A detailed report covering the project's architecture, features, and implementation journey.

Our Nexus AI – Autonomous IT Co-Manager is now fully deployed and live. That’s a major milestone — it shows we’ve completed:
✅ Full Agentic AI integration (Gemini + Genkit)
✅ Next.js + Firebase deployment
✅ Live dashboard and voice assistant
✅ Production hosting setup in Firebase Studio

Nexus is a proactive Agentic AI solution for IT management that redefines IT operations by moving beyond simple automation to create a truly autonomous, intelligent partner. Unlike traditional IT automation tools that only follow predefined rules, Nexus can understand high-level goals and independently plan, execute, and adapt its actions to achieve them. It acts as an intelligent "project manager" for your IT infrastructure, handling everything from routine tasks to complex, multi-step problem-solving.

This project was built for the SuperHack 2025 (Google Cloud + Firebase AI Challenge).

## 🚀 The Nexus Advantage: Key Features

*   **Real-time Dashboard**: A central web application for IT managers to oversee the agent's actions, view performance metrics, and set high-level goals.
*   **Goal-Based Task Management**: Users can give the agent natural language goals (e.g., "Ensure all systems are patched to the latest security standards").
*   **Multi-step Task Execution**: The agent can break down a single goal into multiple, sequential tasks and execute them across different systems.
*   **Proactive Issue Resolution**: Identifies and fixes problems autonomously without waiting for a human to create a ticket or send a command.
*   **Conversational AI with Voice**: Allows for quick, natural-language interaction with the agent through a chat interface that supports both voice input (Speech-to-Text) and spoken audio responses (Text-to-Speech).
*   **Automated Root Cause Analysis**: Generates detailed reports explaining its reasoning and the steps it took to solve a problem.
*   **Third-Party Integrations**: Seamlessly connects with existing IT tools like Jira for ticketing, Slack for communication, and various monitoring systems.

## 🛠️ Technology Stack

| Layer      | Tools / Frameworks                                        |
|------------|-----------------------------------------------------------|
| **Frontend**   | Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI, Recharts |
| **Backend**    | Next.js Server Actions, Firebase Authentication           |
| **AI Layer**   | Google Gemini Pro API + Genkit (including TTS models)     |
| **Data**       | Firestore (Real-time Collections)                         |
| **Hosting**    | Firebase App Hosting                                      |

## 🏁 Getting Started

This is a Firebase Studio project, which simplifies setup and deployment.

### Prerequisites

*   Node.js and npm installed.
*   A Firebase project with Firestore and Authentication enabled.

### Installation & Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Servers**:
    This project requires two development servers to be running simultaneously:
    *   The Next.js frontend server.
    *   The Genkit development server for the AI flows.

    You can run them in separate terminal windows:

    **Terminal 1: Run the Next.js App**
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:3000`.

    **Terminal 2: Run the Genkit Flows**
    ```bash
    npm run genkit:watch
    ```
    This command starts the Genkit development server and watches for changes in your AI flow files.

## 📂 Project Structure

To make the codebase easy to navigate for judges, the key files are organized into distinct frontend and backend sections.

### Frontend (Next.js & React Components)

*   `src/app/`: Contains all pages and layouts for the Next.js application, following the App Router paradigm. Each folder (e.g., `/dashboard`, `/tasks`) corresponds to a URL route.
*   `src/components/`: The heart of the UI, containing all reusable React components.
    *   `src/components/dashboard/`: Components specifically for the main dashboard, like `GoalForm`, `TasksList`, and `AlertsCard`.
    *   `src/components/app-sidebar.tsx`: The main application sidebar, which now contains all navigation logic.
    *   `src/components/ui/`: Reusable, generic UI elements from ShadCN, such as `Button`, `Card`, and `Input`.
*   `src/lib/data.ts` & `src/lib/data-help.ts`: These files contain the static mock data for tasks, alerts, systems, and help content used to populate the UI for the demo.
*   `src/lib/firestore-types.ts`: Defines all the TypeScript types for our Firestore data structures, ensuring type safety.

### Backend & AI (Server Actions & Genkit Flows)

*   `src/lib/actions.ts`: This file acts as the primary backend endpoint, using **Next.js Server Actions**. It defines all the functions that are called from the client to trigger server-side logic, such as submitting a goal, generating a report, or resolving an alert.
*   `src/ai/flows/`: This directory contains all the **Genkit AI flows** that define the logic for the different AI agents.
    *   `multi-step-task-execution.ts`: The "Planner Agent" that breaks down user goals into actionable steps.
    *   `task-execution-simulation.ts`: The "Executor Agent" that simulates running each task step.
    *   `rca-report-generation.ts`: The "Reporter Agent" that generates Root Cause Analysis reports.
    *   `proactive-issue-resolution.ts`: The agent that analyzes alerts and proposes solutions.
    *   `conversational-rca.ts`: the AI logic for the System Health Assistant, including the tools it can use to query data.
    *   `command-simulation.ts`: Powers the AI-driven command console.
    *   `tts.ts`: The Text-to-Speech flow that converts AI responses into spoken audio.
*   `src/lib/firebase/admin.ts`: Initializes the Firebase Admin SDK for server-side access to Firestore.
*   `src/lib/firestore-helpers.ts`: Contains the reusable helper functions for all database operations (CRUD).

---
*   [`PROJECT_REPORT.md`](./PROJECT_REPORT.md): A detailed report covering the project's architecture, features, and implementation journey.
