# System Architecture

## 1. High-Level Overview

The application is a Single Page Application (SPA) built with React. It uses a centralized state object to manage the "Virtual Shift," tracking the current view, user logs, and session status. The core logic relies on a robust integration with the Google Gemini API to act as both a "Mentor" (Guidance) and "Coach" (Feedback).

## 2. Directory Structure

```
/
├── components/          # React UI Components
│   ├── views/           # Specific scenario views
│   │   ├── PMSView.tsx     # Static Charts (QuickChart)
│   │   ├── PhoneView.tsx   # Interactive Decision Buttons
│   │   ├── TabletView.tsx  # Toggleable Specs
│   │   └── FolderView.tsx  # Static Report
│   ├── Dashboard.tsx    # CSS-Art Desk & Navigation
│   ├── Logbook.tsx      # Side-panel with 'Coach' logic
│   ├── MentorPanel.tsx  # Floating AI guidance component
│   └── Survey.tsx       # Mandatory reflection form
├── services/
│   └── geminiService.ts # AI API interaction, retry logic, prompts
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
*   **`logbook`**: A dictionary mapping `ViewState` keys to string content.
*   **`shiftStarted`**: Boolean flag for the login state.
*   **`notifications`**: Flags to trigger visual cues (red dots/animations).
*   **`surveyData`**: Stores the response from the final reflection survey (Strategic Thinking, Ease of Use, etc.).

## 4. AI Service Integration (`geminiService.ts`)

The app leverages the Google Gemini API for three distinct functions:

1.  **Contextual Mentorship (The Panel):**
    *   *Component:* `MentorPanel.tsx`
    *   *Function:* `getMentorGuidance`
    *   *Behavior:* Watches the `ViewState`. When a student enters `PMS`, it prompts them to look for bottlenecks. It acts as a "Guide on the Side."

2.  **Formative Feedback (The Coach):**
    *   *Component:* `Logbook.tsx`
    *   *Function:* `getLogEntryFeedback`
    *   *Behavior:* When the student clicks "Save & Evaluate," the specific log entry is sent to Gemini. The prompt enforces a **2-sentence constraint** to provide concise, actionable feedback on their application of theory.

3.  **Summative Assessment (The Report):**
    *   *Component:* `App.tsx` (Handover)
    *   *Function:* `generateFinalReportFeedback`
    *   *Behavior:* Aggregates all logs and evaluates them against a provided **Rubric Matrix** to generate qualitative feedback for LO1-LO5.

**Resilience:**
A `callWithRetry` wrapper implements **Exponential Backoff** to handle `429 Resource Exhausted` errors gracefully.

## 5. Visual System

*   **Dashboard:** 
    *   **Desktop:** Uses pure CSS and HTML elements to draw a "Cartoon Hotel Lobby." No external image assets are used for the environment, ensuring fast load times and sharp scaling.
    *   **Mobile:** Falls back to a stacked list view for touch accessibility.
*   **Charts:** 
    *   The `PMSView` generates chart URLs using the `QuickChart.io` API. This allows us to render complex data visualizations (Bottlenecks, Staffing vs Arrivals) as simple `<img>` tags, reducing bundle size (no heavy chart libraries).

## 6. Data Flow

1.  **Login:** User enters ID -> System loads specific JSON from LocalStorage.
2.  **Dashboard:** User hovers over Hotspot -> Tooltip shows Mission -> Click navigates to View.
3.  **Interaction:** 
    *   *Phone:* User clicks "Apologize" -> State updates -> Instruction appears.
    *   *Tablet:* User toggles "Specs" -> Detailed info expands.
4.  **Reflection:** Student uses "Theory Refresher" (API call) -> Writes in Logbook -> Clicks "Evaluate" (API call).
5.  **Submission:** 
    *   End Shift -> Handover View.
    *   **Survey:** Student completes mandatory Likert scale survey.
    *   **Report:** Generate Report -> Download .doc (includes Logs + Feedback + Survey Results).
6.  **Admin Export:** On the Login screen, "Download Class Data" iterates through all localStorage keys, parses the survey data, and creates a CSV export.