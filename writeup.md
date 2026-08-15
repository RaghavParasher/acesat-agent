# One-Page Write-Up: AceSAT AI Agent

## 1. The Problem: The Education & Tutoring Gap
In the United States, SAT scores remain heavily correlated with family income. Wealthier students have access to private SAT prep courses, college consultants, and professional tutors costing hundreds of dollars per hour. Students in underserved public schools, however, often attend classrooms with larger student-to-teacher ratios and return home to households without academic support systems. This dynamic forms a "homework wall" and a "prep wall" that limits social mobility and consolidates educational inequity. 

To bridge this gap, students do not need another simple search engine or a conversational chatbot that instantly outputs direct answers (which encourages passive copying). They need an **active tutoring agent**: an intelligent, patient companion that adapts to their pace, scaffolds complex concepts, diagnoses foundational misunderstandings, and coaches them through study fatigue.

---

## 2. How the AceSAT Agent Works
AceSAT goes beyond basic chatbots by implementing a state-driven pedagogical loop that models a human tutor:

*   **Diagnostic Onboarding (Coach Agent)**: On startup, the coach agent initiates a conversational interview with the student to establish their target score, study capacity, and focus subjects. This instantiates a personalized dashboard and weekly plan.
*   **Dynamic Mastery Tracking (Knowledge Graph)**: The system models the student's current proficiency across 7 core SAT Math and Reading topics. Student mastery is represented visually, showing prerequisite connections and status indicators.
*   **Adaptive Problem Routing (Tutor Agent)**: The agent routes students through practice problems. If a student answers a question correctly, the agent elevates the difficulty (Easy ➔ Medium ➔ Hard) and raises mastery. If the student answers incorrectly, the agent lowers the difficulty to reinforce fundamentals.
*   **Multi-Level Scaffolding Engine**: When a student struggles, they can request hints. Instead of giving away the answer, the agent provides progressive help:
    1.  *Level 1*: A conceptual reminder (e.g. formulas or grammar rules).
    2.  *Level 2*: A setup helper (guiding the first mathematical step or text analysis).
    3.  *Level 3*: A near-solution calculation check.
*   **Agent Decision Telemetry**: The application features a live console displaying the agent's calculations, cognitive logs, and diagnostic parameter adjustments in real time, making the agent's logic transparent.

---

## 3. Educational & Social Impact
Deploying AceSAT in underserved schools can create immediate, measurable impact:

1.  **Democratizing Elite Tutoring**: By providing a personalized, adaptive learning flow for free, AceSAT extends high-quality preparation to any student with a browser, closing the resource gap.
2.  **Fostering Mastery Learning**: By leveraging progressive scaffolding rather than direct answers, the agent shifts student habits from "answer-seeking" to "concept-understanding," building true confidence.
3.  **Low-Tech Inclusivity**: The application's optimized layout, lightweight JSON packages, and direct client-side architecture make it fully functional on older Chromebooks, tablets, or low-bandwidth mobile connections common in underserved households.
4.  **Actionable Progress Insights**: The Knowledge Graph visually illustrates student progress, helping them see clear pathways to improvement and motivating them to persist.
