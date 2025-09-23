import * as UI from "./uiController.js";
import * as Quiz from "./quizController.js";
import * as Storage from "./storageService.js";

const THEMES = [
  { id: "html", label: "HTML", icon: "📄" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "javascript", label: "JavaScript", icon: "✨" },
  { id: "python", label: "Python", icon: "🐍" },
];

document.addEventListener("DOMContentLoaded", () => {
  Storage.initStorage();
  const startBtn = document.getElementById("start-quiz");
  if (!startBtn) {
    console.warn("#start-quiz not found in DOM — nothing to do.");
    return;
  }
  startBtn.addEventListener("click", () => {
    UI.showThemeSelection({
      themes: THEMES,
      onThemeSelect: (themeId) => {
        UI.showChoiceLevelName({
          selectedTheme: themeId,
          onStart: async ({ username, level, theme }) => {
            Storage.setUsername(username);
              Storage.setLevel(level);
              Storage.setTheme(theme);

            try {
              const res = await fetch(`data/${theme}.json`, {
                cache: "no-store",
              });
              if (!res.ok) throw new Error("Failed to load theme data");
              const themeData = await res.json();
              const questionsForLevel = (themeData[level] || []).slice();
              if (!questionsForLevel || questionsForLevel.length === 0) {
                alert("No questions found for this theme & level.");
                return;
              }
              Quiz.startQuiz(questionsForLevel, { username, level, theme });
            } catch (err) {
              console.error("Failed to load theme data", err);
              alert("Could not load questions for that theme. See console.");
            }
          },
        });
      },
    });
  });
});
