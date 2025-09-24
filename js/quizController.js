import * as UI from "./uiController.js";
import * as Storage from "./storageService.js";
import { safeNumber } from "./utils.js";

let activeQuestions = [];
let currentIndex = 0;
let answersSelected = [];
let userSelections = [];
let startTime = null;
let countdown = null;
export function startQuiz(questionsArray = [], meta = {}) {
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    alert("No questions to start.");
    return;
  }
  activeQuestions = questionsArray.slice();
  currentIndex = 0;
  answersSelected = [];
  userSelections = [];
  startTime = Date.now();
  const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "none";

  renderQuestion(currentIndex);
}
export function renderQuestion(index) {
  const q = activeQuestions[index];
  if (!q) return;

  const { validateButton, getSelectedIndices, focusFirstInput } =
    UI.renderQuestionUI({
      q,
      index,
      total: activeQuestions.length,
    });

  let timerLeft = safeNumber(q.time, 15) || 15;
  UI.updateTimerText(timerLeft);
  UI.setTimerState("");
  UI.setTimerVisible(true);

  clearInterval(countdown);
  countdown = setInterval(() => {
    timerLeft--;
    UI.updateTimerText(timerLeft);

    if (timerLeft <= 3 && timerLeft > 0) UI.setTimerState("warning");
    else UI.setTimerState("");

    if (timerLeft <= 0) {
      clearInterval(countdown);
      UI.setTimerState("expired");
      submitAnswer(true);
    }
  }, 1000);

  function captureSelection() {
    const selected = getSelectedIndices();
    userSelections[index] = selected;
    return selected;
  }

  function proceedAfterSelection(markedCorrect) {
    clearInterval(countdown);
    validateButton.disabled = true;
    answersSelected[index] = !!markedCorrect;
    q._wasCorrect = !!markedCorrect;

    currentIndex++;
    if (currentIndex < activeQuestions.length) {
      renderQuestion(currentIndex);
    } else {
      finishQuiz();
    }
  }
  function submitAnswer(fromTimeout = false) {
    if (validateButton.disabled) return;

    const selected = captureSelection();
    const multiple = (q.correct || []).length > 1;
    const correct = (q.correct || []).map(Number).sort((a, b) => a - b);

    if (!selected || selected.length === 0) {
      if (!fromTimeout) {
        alert(
          multiple
            ? "Choose at least one answer please!"
            : "Choose an answer please!"
        );
        return;
      }
      clearInterval(countdown);
      validateButton.disabled = true;
      Array.from(
        container.querySelectorAll(`input[name="q${currentIndex}"]`)
      ).forEach((i) => (i.disabled = true));
      UI.visualFeedback(currentIndex, [], correct, () => {
        proceedAfterSelection(false);
      });
      return;
    }

    let isCorrect = false;
    if (multiple) {
      const sortedSelected = selected.map(Number).sort((a, b) => a - b);
      isCorrect =
        sortedSelected.length === correct.length &&
        sortedSelected.every((v, i) => v === correct[i]);
    } else {
      isCorrect = Number(selected[0]) === correct[0];
    }

    clearInterval(countdown);
    validateButton.disabled = true;
    Array.from(
      container.querySelectorAll(`input[name="q${currentIndex}"]`)
    ).forEach((i) => (i.disabled = true));

    UI.visualFeedback(currentIndex, selected.map(Number), correct, () => {
      proceedAfterSelection(!!isCorrect);
    });
  }

  validateButton.addEventListener("click", function () {
    submitAnswer(false);
  });

  if (typeof focusFirstInput === "function") focusFirstInput();
}

function finishQuiz() {
  clearInterval(countdown);
  const elapsed = Date.now() - (startTime || Date.now());
  const correctCount = answersSelected.filter(Boolean).length;

  const attempt = {
    username: Storage.getUsername() || "anonymous",
    date: new Date().toISOString(),
    score: correctCount + "/10",
    level: Storage.getLevel() || null,
    theme: Storage.getTheme() || null,
    answers: userSelections,
    elapsedMs: elapsed,
  };

  try {
    localStorage.removeItem("username");
    localStorage.removeItem("level");
    localStorage.removeItem("theme");
    Storage.saveAttempt(attempt);
  } catch (e) {
    console.error("Could not save attempt:", e);
  }

  UI.showResultUI({
    score: correctCount,
    total: activeQuestions.length,
    userSelections,
    activeQuestions,
    elapsedMs: elapsed,
    onRestart: () => restartQuiz(),
  });
}

export function restartQuiz() {
  clearInterval(countdown);
  currentIndex = 0;
  answersSelected = [];
  userSelections = [];
  startTime = null;
  activeQuestions = [];

  const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "";
  const title = document.querySelector("h1");
  const para = document.querySelector("p");
  if (title) title.textContent = "JSQuizStarter";
  if (para) para.textContent = "Press Start to begin the quiz.";
  const container = document.getElementById("container");
  if (container) container.innerHTML = "";
}
