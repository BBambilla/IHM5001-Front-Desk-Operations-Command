# Front Desk: Operations Command

**Front Desk: Operations Command** is an immersive hospitality simulation tool designed to help students reflect on operational theories, social intelligence, and sustainability practices. It acts as a "Virtual Reception Desk," providing a high-fidelity dashboard where students manage a hotel shift, respond to scenarios, and receive real-time AI feedback based on academic learning outcomes.

## 🚀 Key Features

*   **Immersive Dashboard:** A visual "Command Center" with interactive hotspots (PMS Monitor, Phone, Tablet, Physical Folder).
*   **Scenario-Based Learning:** Specific operational challenges linked to course lessons:
    *   *PMS:* Efficiency analysis (Little's Law, Bottlenecks).
    *   *Phone:* Social Intelligence & guest recovery.
    *   *Folder:* Sustainability audits (Triple Bottom Line, Circular Economy).
    *   *Tablet:* Technology strategy (Cost vs. Differentiation).
*   **AI Mentor:** A persistent AI assistant (powered by Google Gemini) that offers Socratic questioning based on the specific view context.
*   **Smart Logbook:**
    *   **Theory Refresher:** One-click concise definitions of relevant theories.
    *   **Instant Evaluation:** "Save & Evaluate" button provides 2-sentence formative feedback on student entries.
    *   **Auto-Save:** Entries persist across sessions using LocalStorage.
*   **Assessment & Handover:**
    *   **Shift Handover:** Summarizes all logs.
    *   **Rubric-Based Reporting:** Generates a qualitative feedback report based on specific Learning Outcomes (LO1-LO5).
    *   **Export:** Downloadable Word (.doc) report for submission.
*   **Mobile Friendly:** Fully responsive design for learning on the go.

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS
*   **AI Integration:** Google Gemini API (`@google/genai`)
*   **Visualization:** QuickChart.io (Static chart generation)
*   **Persistence:** Browser LocalStorage
*   **Build Tooling:** ESBuild (assumed environment)

## 🏁 Getting Started

1.  **Prerequisites:** Node.js installed and a valid Google Gemini API Key.
2.  **Installation:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    Ensure `process.env.API_KEY` is accessible in the build environment.
4.  **Run:**
    ```bash
    npm start
    ```

## 🎓 Learning Outcomes (LOs)

The simulation directly maps student actions to the following:
*   **LO1 & LO2:** Operational Strategy & Knowledge Understanding.
*   **LO3:** Sustainability & Service Design.
*   **LO4:** Strategic Thinking & Technology Innovation.
*   **LO5:** Social Intelligence & Inclusivity.
