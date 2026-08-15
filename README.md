# 🚀 AceSAT: Adaptive SAT Prep & AI Study Coach Agent

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://acesat-agent.vercel.app/)
[![GitHub License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-8.2.1-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)

> **Submission for the AceSAT Education AI-Agent Hackathon**  
> *Empowering underserved public school students with a tireless, adaptive, private AI-tutor.*

---

## 🔗 Project Links
*   **Live Web Application**: [https://acesat-agent.vercel.app/](https://acesat-agent.vercel.app/)
*   **GitHub Repository**: [https://github.com/RaghavParasher/acesat-agent](https://github.com/RaghavParasher/acesat-agent)
*   **Submission Write-Up**: [writeup.md](writeup.md)

---

## 💡 The Problem: The Tutoring Gap
Wealthy families spend thousands of dollars on private SAT prep, structured homework support networks, and personal coaching. For students in underserved public schools, these resources are entirely out of reach. Standard search tools and basic Q&A chatbots do not close this gap; they often provide direct answers immediately, which encourages passive copy-pasting and leads to frustration or surface-level learning.

### The Solution: AceSAT
AceSAT is an **active learning companion** that models a human private tutor. By structuring the AI as a proactive agent that makes pedagogical choices (adjusting difficulty, choosing scaffolded hints, and tracking concept mastery), we create an equitable tutoring companion. It is highly accessible, responsive, and available 24/7.

---

## 🎨 Visual Identity & UI Polish
AceSAT is styled with a custom-engineered, premium dark theme utilizing refined CSS variables, frosted-glass components, and custom-tuned cubic bezier transitions:
*   **Glassmorphism Navigation**: A frosted-glass header with `backdrop-filter: blur(12px)` floats above the page content.
*   **Depth-Enhancing Gradients**: Workspace panels feature a rich radial gradient from deep slate blue (`hsl(222, 47%, 12%)`) to solid dark-slate (`hsl(222, 47%, 6%)`) in dark mode.
*   **Circular score Progress Meter**: The dashboard features an SVG-drawn circular mastery completion ring that dynamically updates and fills relative to a 1600 target.
*   **Tactile Shaking Feedback**: Option buttons perform a spring-based shake animation (`@keyframes shake`) when an incorrect answer is submitted, providing intuitive visual feedback.

---

## 🤖 System Architecture & Flow

```mermaid
graph TD
    A[Student Interface] --> B[App Orchestrator state]
    B --> C[Coach Agent state]
    B --> D[Tutor Agent state]
    B --> E[Knowledge Graph View]
    
    C --> F[Weekly Plan & Goals]
    D --> G[Adaptive Diagnostic Engine]
    G --> H[Gemini 1.5 Flash API]
    G --> I[Local Curriculum Fallback]
    
    B --> J[Agent Decision Console Logs]
    D --> J
    C --> J
```

---

## 🌟 Core Modules

### 1. Onboarding & Study Coach (Coach Agent)
*   **Socratic Onboarding**: The coach agent initiates a conversational onboarding flow to collect the student's target score, study capacity, and focus areas.
*   **Personalized Study Plan**: Instantiates a weekly study plan inside the dashboard based on student responses.
*   **Contextual Dialogue**: Suggests specific strategies and guides students on time-management and mindset.

### 2. Adaptive Prep Workspace (Tutor Agent)
*   **Diagnostic Routing**: An engine that continuously recalculates topic mastery. Correct answers increase mastery and escalate the active question difficulty (Easy ➔ Medium ➔ Hard). Incorrect answers adjust the difficulty down to reinforce fundamentals.
*   **Three-Level Scaffolding Engine**: Students can request hints that scale from *Level 1: Conceptual Reminder* to *Level 2: Step Guide*, and finally *Level 3: Near-Solution Calculation Hint*, preventing them from getting stuck without giving away the answer.
*   **Agent Forecast Tool**: Displays a real-time predictive forecast of what pedagogical routing actions the agent will perform based on the student's next response.

### 3. Interactive Knowledge Graph
*   **Visual Prerequisite Maps**: Renders coordinates-based SVG connections illustrating SAT topic links.
*   **Topic Color-Coding**: Instantly highlights topic mastery levels: **Green (Mastered >75%)**, **Yellow (Developing)**, and **Red (Focus Area <50%)**.
*   **Direct Context Launcher**: Click any node to review curriculum details and launch specialized practice sessions.

### 4. Agent Decision Console (Telemetry Log)
*   A scrolling terminal-like window that renders entries with JetBrains Mono, showing timestamps, category badges (e.g. `[Planner]`, `[Diagnostic]`, `[Scaffolding]`), and colored text to show the agent's internal thinking log in real time.

---

## 🪵 Agent Telemetry Logs Examples

Watch the agent think in the sidebar console as you interact. Below are examples of logged telemetry:

*   **Onboarding Completion**:
    ```text
    [7:40:02 PM] [Coach Agent] Onboarding completed! Profile variables: Target Score=1500+, Study Hours=5-8 hours, Focus=Math (Algebra, Geometry)
    ```
*   **Incorrect Diagnostic routing**:
    ```text
    [7:41:35 PM] [Diagnostic Engine] Question answered INCORRECTLY. Identifying gaps in Circle & Coordinate Geometry. Score change: -5%. Level adjustment: Hard -> Medium. Triggering scaffolding support.
    ```
*   **Scaffolding Request**:
    ```text
    [7:41:40 PM] [Scaffolding Engine] Student requested Hint Level 1 for Question m_geom_hard. Injecting guidance: "Remember standard circle equation..."
    ```

---

## 📦 Installation & Setup

Ensure you have **Node.js** (v18 or higher) installed on your system.

1.  **Clone or Extract the Project**:
    ```bash
    git clone https://github.com/RaghavParasher/acesat-agent.git
    cd acesat-agent
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables** (Optional, for Live AI Mode):
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173/` in your browser.

5.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.
