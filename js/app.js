// Main application entry point - handles quiz initialization and theme selection
import * as UI from "./uiController.js";
import * as Quiz from "./quizController.js";
import * as Storage from "./storageService.js";
import { statesUI } from "./stats.js";

// Available quiz themes with icons and labels
const QUIZ_THEMES = [
  { id: "html", label: "HTML", icon: "📄" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "javascript", label: "JavaScript", icon: "✨" },
  { id: "python", label: "Python", icon: "🐍" },
];

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize local storage for quiz history
  Storage.initStorage();

  const startButton = document.getElementById("start-quiz");
  if (!startButton) {
    console.warn("Start quiz button not found in DOM");
    return;
  }
  startButton.addEventListener("click", handleStartQuiz);
});

/* Handles the start quiz button click - shows theme selection */
function handleStartQuiz() {
  UI.showThemeSelection({
    themes: QUIZ_THEMES,
    onThemeSelect: handleThemeSelection,
  });
}

/* Handles theme selection and shows level/name input */
function handleThemeSelection(selectedThemeId) {
  UI.showChoiceLevelName({
    selectedTheme: selectedThemeId,
    onStart: handleQuizStart,
  });
}

/* Handles quiz start after user enters name and selects level */
async function handleQuizStart({ username, level, theme }) {
  Storage.setUsername(username);
  Storage.setLevel(level);
  Storage.setTheme(theme);

  try {
    // Load questions for the selected theme
    const response = await fetch(`data/${theme}.json`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load theme data: ${response.status}`);
    }

    const themeData = await response.json();
    const questionsForLevel = (themeData[level] || []).slice();

    // Validate that questions exist for this level
    if (!questionsForLevel || questionsForLevel.length === 0) {
      alert(`No questions found for ${theme} at ${level} level.`);
      return;
    }

    // Start the quiz with loaded questions
    Quiz.startQuiz(questionsForLevel, { username, level, theme });
  } catch (error) {
    console.error("Failed to load quiz data:", error);
    alert("Could not load questions for that theme. Please try again.");
  }
}
