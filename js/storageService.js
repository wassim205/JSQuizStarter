
const HISTORY_KEY = "quizHistory";
const USER_KEY = "username";
const LEVEL_KEY = "level";
const THEME_KEY = "theme";

export function initStorage() {
  if (!localStorage.getItem(HISTORY_KEY)) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  }
}

export function saveAttempt(attempt) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history.push(attempt);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save quiz history:", e);
  }
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function setUsername(name) {
  try {
    localStorage.setItem(USER_KEY, name);
  } catch (e) {
    console.error("Failed to set username", e);
  }
}

export function getUsername() {
  return localStorage.getItem(USER_KEY) || "";
}

export function setLevel(level) {
  try {
    localStorage.setItem(LEVEL_KEY, level);
  } catch (e) {
    console.error("Failed to set level", e);
  }
}

export function getLevel() {
  return localStorage.getItem(LEVEL_KEY) || "";
}

export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    console.log("Failed to set theme", e);
  }
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "";
}
