# Front Desk: Operations Command

**Front Desk: Operations Command** is an immersive hospitality simulation tool designed to help students reflect on operational theories, social intelligence, and sustainability practices. It acts as a "Virtual Reception Desk," providing a high-fidelity cartoon-style dashboard where students manage a hotel shift, respond to scenarios, and receive real-time AI feedback.

## 🚀 Key Features

### 🏨 The Visual Command Center
*   **Cartoon Hotel Dashboard:** A fully CSS-illustrated reception desk environment.
*   **Interactive Hotspots:**
    *   **PMS Monitor:** View efficiency data and process flow charts (visualized via QuickChart).
    *   **Phone:** Handle live guest complaints with decision-based interactions (Apologize vs. Explain).
    *   **Tablet:** Toggle between "Tech Hub" marketing summaries and deep-dive technical specifications.
    *   **Green Folder:** Audit sustainability reports and energy consumption data.
*   **Mission Briefings:** Hover over any item on the desk to see a "Mission Summary" before engaging.

### 🧠 AI-Powered Learning (Google Gemini)
*   **AI Operations Mentor:** A passive guidance panel that analyzes the student's current view and prompts Socratic reflection (e.g., "Consider Little's Law here").
*   **Operations Coach (Logbook):**
    *   **Instant Feedback:** The "Save & Evaluate" button provides immediate, 2-sentence formative feedback on log entries.
    *   **Theory Refresher:** A prominent help button that pulls up concise definitions of relevant theories (e.g., Mura, Triple Bottom Line).
*   **Assessment Report:** Generates a qualitative feedback report based on specific Learning Outcomes (LO1-LO5) via a downloadable Word document.

### 📊 Reflection Survey & Data
*   **Mandatory Student Survey:** Before accessing the final report, students complete a 7-question reflection survey on their experience, strategic thinking, and intellectual autonomy.
*   **Class Data Export:** Instructors can download a CSV file containing the survey results for all students who have used the simulation on that device.

### 💾 Session Management
*   **Student Login:** Sessions are keyed by Student ID.
*   **Auto-Save:** Work is persisted to LocalStorage, allowing students to pause and resume shifts.
*   **Mobile Friendly:** A responsive design that switches from the immersive desk view (Desktop) to an efficient list view (Mobile).

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (Custom CSS art for Dashboard)
*   **AI Integration:** Google Gemini API (`@google/genai`)
*   **Visualization:** QuickChart.io (Static chart generation for PMS)
*   **Persistence:** Browser LocalStorage

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