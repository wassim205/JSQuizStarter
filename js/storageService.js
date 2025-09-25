// Storage keys for different data types
const STORAGE_KEYS = {
  HISTORY: "quizHistory",
  USERNAME: "username",
  LEVEL: "level",
  THEME: "theme",
};

/* Initializes local storage with empty quiz history if not exists */
export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  }
}

/* Saves a quiz attempt to local storage history */
export function saveAttempt(attempt) {
  try {
    const history = getHistory();
    history.push(attempt);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save quiz attempt:", error);
  }
}

/* Retrieves quiz history from local storage */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
  } catch (error) {
    console.error("Failed to retrieve quiz history:", error);
    return [];
  }
}

/* Saves username to local storage */
export function setUsername(username) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERNAME, username);
  } catch (error) {
    console.error("Failed to save username:", error);
  }
}

/* Retrieves username from local storage */
export function getUsername() {
  return localStorage.getItem(STORAGE_KEYS.USERNAME) || "";
}

/* Saves selected difficulty level to local storage */
export function setLevel(level) {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVEL, level);
  } catch (error) {
    console.error("Failed to save level:", error);
  }
}

/* Retrieves difficulty level from local storage */
export function getLevel() {
  return localStorage.getItem(STORAGE_KEYS.LEVEL) || "";
}

/* Saves selected theme to local storage
 */
export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
}

/* Retrieves theme from local storage */
export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || "";
}

/* Clears user session data (username, level, theme) from storage */
export function clearSessionData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.LEVEL);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  } catch (error) {
    console.error("Failed to clear session data:", error);
  }
}
