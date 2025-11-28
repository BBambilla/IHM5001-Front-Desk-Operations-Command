export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PMS = 'PMS', // Monitor
  PHONE = 'PHONE', // Social Intelligence
  TABLET = 'TABLET', // Tech Stack
  FOLDER = 'FOLDER', // Sustainability
  HANDOVER = 'HANDOVER', // End session summary
}

export interface LogEntry {
  id: string;
  section: ViewState;
  content: string;
  timestamp: string;
}

export interface AppState {
  studentId: string;
  view: ViewState;
  logbook: Record<ViewState, string>; // One active draft per section
  shiftStarted: boolean;
  notifications: {
    phone: boolean;
    tablet: boolean;
    folder: boolean;
  };
}

export const INITIAL_LOGBOOK_STATE = {
  [ViewState.DASHBOARD]: "",
  [ViewState.PMS]: "",
  [ViewState.PHONE]: "",
  [ViewState.TABLET]: "",
  [ViewState.FOLDER]: "",
  [ViewState.HANDOVER]: "",
};