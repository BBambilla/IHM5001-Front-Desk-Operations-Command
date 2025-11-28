# System Architecture

## 1. High-Level Overview

The application is a Single Page Application (SPA) built with React. It uses a centralized state object to manage the "Virtual Shift," tracking the current view, user logs, and session status. The core logic relies on a robust integration with the Google Gemini API to act as a dynamic "Mentor" and "Assessor."

## 2. Directory Structure

```
/
├── components/          # React UI Components
│   ├── views/           # Specific scenario views (PMS, Phone, etc.)
│   ├── Dashboard.tsx    # Main visual navigation hub
│   ├── Logbook.tsx      # Slide-out notebook with AI interaction
│   └── MentorPanel.tsx  # Floating AI guidance component
├── services/
│   └── geminiService.ts # AI API interaction, retry logic, prompt engineering
├── docs/                # Documentation
├── App.tsx              # Main controller and routing logic
├── types.ts             # TypeScript definitions and Enums
└── index.tsx            # Entry point
```

## 3. State Management

State is managed via React's `useState` hook in `App.tsx` and persisted to `LocalStorage`.

**`AppState` Interface:**
*   **`studentId`**: Unique identifier for the user session.
*   **`view`**: The current screen (`DASHBOARD`, `PMS`, `PHONE`, `TABLET`, `FOLDER`, `HANDOVER`).
*   **`logbook`**: A dictionary mapping `ViewState` keys to string content (the student's notes).
*   **`shiftStarted`**: Boolean flag for the login state.
*   **`notifications`**: Flags to trigger visual cues (red dots/animations) on dashboard items.

**Persistence Strategy:**
Data is saved to `localStorage` under the key `front-desk-ops-state-{studentId}`. This allows multiple students to use the same device or a single student to resume work later.

## 4. AI Service Integration (`geminiService.ts`)

The app leverages the Google Gemini API for three distinct functions:

1.  **Mentor Guidance:**
    *   *Trigger:* View change.
    *   *Mechanism:* Sends the current `ViewState` and `LogContent` to Gemini.
    *   *Prompt:* System instructions enforce Socratic questioning based on specific Hospitality theories (e.g., "Ask about Little's Law").

2.  **Instant Feedback:**
    *   *Trigger:* User clicks "Save & Evaluate" in Logbook.
    *   *Mechanism:* Sends specific log entry.
    *   *Prompt:* Requests exactly 2 sentences of constructive feedback.

3.  **Final Assessment Report:**
    *   *Trigger:* "Generate Report" in Handover view.
    *   *Mechanism:* Aggregates all logbook entries and sends them alongside a full **Rubric Matrix**.
    *   *Output:* JSON object containing feedback for LO1-LO5, which is then rendered and exported.

**Reliability:**
A `callWithRetry` wrapper implements **Exponential Backoff** to handle `429 Resource Exhausted` errors gracefully, ensuring the app remains usable even under API quota limits.

## 5. Visual Components

*   **Dashboard:** Uses a high-quality background image with absolute positioning (desktop) or stacked flexbox (mobile) to create the "Desk" metaphor.
*   **Charts:** Uses `QuickChart.io` to generate static images for the PMS view, ensuring fast loading and specific data visualization without heavy client-side charting libraries.
*   **Logbook:** A persistent side-panel (or full-screen on mobile) that serves as the primary user input mechanism.

## 6. Data Flow

1.  **User Input:** Student enters ID -> State loaded from Storage.
2.  **Navigation:** Student clicks Dashboard hotspot -> View changes -> Mentor API triggered.
3.  **Analysis:** Student types in Logbook -> State updated -> "Evaluate" triggers Feedback API.
4.  **Completion:** Student ends shift -> "Handover" view -> "Generate Report" triggers Assessment API -> `.doc` file created.
