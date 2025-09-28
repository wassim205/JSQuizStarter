import { createEl, formatSeconds } from "./utils.js";

/* Page / container references */
const pageTitle = document.querySelector("h1");
const pageDescription = document.querySelector("p");
const mainContainer = document.getElementById("container");

/* Timer element: create if missing */
let timerElement = document.getElementById("timer");
if (!timerElement) {
  timerElement = createEl("div", { id: "timer" });
  timerElement.style.marginBottom = "8px";
  const header = document.querySelector("h1");
  if (header && header.parentNode) header.insertAdjacentElement("afterend", timerElement);
  else if (mainContainer) mainContainer.prepend(timerElement);
}
timerElement.classList.remove("visible", "warning", "expired");

/* --- Timer helpers --- */
export function updateTimerText(text) { if (!timerElement) return; timerElement.textContent = text; }
export function setTimerState(state) {
  if (!timerElement) return;
  timerElement.classList.remove("warning", "expired");
  if (state === "warning") timerElement.classList.add("warning");
  else if (state === "expired") timerElement.classList.add("expired");
}
export function setTimerVisible(visible = true) {
  if (!timerElement) return;
  timerElement.classList.toggle("visible", !!visible);
}

/* Safe container clear (don't touch outer layout) */
export function clearContainer() {
  if (!mainContainer) return;
  while (mainContainer.firstChild) mainContainer.removeChild(mainContainer.firstChild);
}

/* --------- Choice screen (username + level) --------- */
export function showChoiceLevelName({ onStart, selectedTheme = null }) {
  if (!mainContainer) return;
  const startButton = document.getElementById("start-quiz");
  if (startButton) startButton.style.display = "none";

  pageTitle.textContent = "JSQuizStarter";
  pageDescription.textContent = "Please enter your username and choose a difficulty level.";
  clearContainer();

  const storedUsername = localStorage.getItem("username") || "";

  if (selectedTheme) {
    const themeDisplay = createEl("div", { text: `Selected Theme: ${selectedTheme}`, className: "theme-display" });
    themeDisplay.style.fontWeight = "700";
    themeDisplay.style.marginBottom = "16px";
    themeDisplay.style.padding = "12px";
    themeDisplay.style.backgroundColor = "#eff6ff";
    themeDisplay.style.borderRadius = "8px";
    themeDisplay.style.border = "2px solid #3b82f6";
    mainContainer.appendChild(themeDisplay);
  }

  const usernameLabel = createEl("label", { text: "Username" });
  usernameLabel.style.display = "block";
  usernameLabel.style.marginBottom = "8px";
  usernameLabel.style.fontWeight = "600";

  const usernameInput = createEl("input", { type: "text", name: "username", placeholder: "Enter your name" });
  usernameInput.value = storedUsername;

  mainContainer.appendChild(usernameLabel);
  mainContainer.appendChild(usernameInput);

  const levelOptions = ["easy", "medium", "hard"];
  const levelLabel = createEl("label", { text: "Difficulty Level" });
  levelLabel.style.display = "block";
  levelLabel.style.marginBottom = "8px";
  levelLabel.style.fontWeight = "600";

  const levelSelect = createEl("select");
  const defaultOption = createEl("option", { value: "", text: "Select difficulty level" });
  levelSelect.appendChild(defaultOption);
  levelOptions.forEach((level) => {
    const option = createEl("option", { value: level, text: level.charAt(0).toUpperCase() + level.slice(1) });
    levelSelect.appendChild(option);
  });

  mainContainer.appendChild(levelLabel);
  mainContainer.appendChild(levelSelect);

  const controlsContainer = createEl("div");
  controlsContainer.style.marginTop = "20px";
  controlsContainer.style.display = "flex";
  controlsContainer.style.gap = "12px";
  controlsContainer.style.flexWrap = "wrap";

  const startQuizButton = createEl("button", { type: "button", text: "Start Quiz" });
  startQuizButton.style.flex = "1";
  startQuizButton.style.minWidth = "120px";

  const cancelButton = createEl("button", { type: "button", text: "Cancel" });
  cancelButton.style.flex = "1";
  cancelButton.style.backgroundColor = "#6b7280";
  cancelButton.style.minWidth = "120px";

  controlsContainer.appendChild(startQuizButton);
  controlsContainer.appendChild(cancelButton);
  mainContainer.appendChild(controlsContainer);

  function handleStartQuiz() {
    const username = (usernameInput.value || "").trim();
    const selectedLevel = levelSelect.value;
    if (!username) { alert("Please enter your username before starting."); usernameInput.focus(); return; }
    if (!selectedLevel) { alert("Please choose a difficulty level!"); levelSelect.focus(); return; }
    cleanup();
    if (typeof onStart === "function") onStart({ username, level: selectedLevel, theme: selectedTheme });
  }

  function handleCancel() {
    cleanup();
    pageTitle.textContent = "JSQuizStarter";
    pageDescription.textContent = "Challenge yourself with interactive quizzes that make you stronger!";
    clearContainer();
    if (startButton) startButton.style.display = "";
  }

  function handleKeyPress(event) { if (event.key === "Enter") handleStartQuiz(); }

  function cleanup() {
    startQuizButton.removeEventListener("click", handleStartQuiz);
    cancelButton.removeEventListener("click", handleCancel);
    usernameInput.removeEventListener("keydown", handleKeyPress);
    levelSelect.removeEventListener("keydown", handleKeyPress);
  }

  startQuizButton.addEventListener("click", handleStartQuiz);
  cancelButton.addEventListener("click", handleCancel);
  usernameInput.addEventListener("keydown", handleKeyPress);
  levelSelect.addEventListener("keydown", handleKeyPress);
  usernameInput.focus();
}

/* --------- render question UI --------- */
export function renderQuestionUI({ q, index, total }) {
  if (!mainContainer) return {};
  pageTitle.textContent = `Question ${index + 1} of ${total}`;
  pageDescription.textContent = q.question;
  clearContainer();

  setTimerState("");
  setTimerVisible(true);

  const isMultipleChoice = (q.correct || []).length > 1;
  const inputType = isMultipleChoice ? "checkbox" : "radio";

  q.options.forEach((optionText, optionIndex) => {
    const optionContainer = createEl("div");
    optionContainer.style.display = "flex";
    optionContainer.style.alignItems = "center";
    optionContainer.style.marginBottom = "8px";
    optionContainer.style.padding = "12px";
    optionContainer.style.borderRadius = "8px";
    optionContainer.style.cursor = "pointer";
    optionContainer.style.transition = "background-color 0.2s";
    optionContainer.style.border = "2px solid transparent";

    const input = createEl("input", { type: inputType, id: `q${index}_opt${optionIndex}`, name: `q${index}`, value: optionIndex });
    input.style.marginRight = "12px";
    input.style.transform = "scale(1.2)";

    const label = createEl("label", { for: `q${index}_opt${optionIndex}`, text: optionText });
    label.style.cursor = "pointer";
    label.style.flex = "1";
    label.style.margin = "0";
    label.style.display = "block";

    optionContainer.addEventListener("click", (e) => {
      if (e.target === input) return;
      if (inputType === "radio") input.checked = true;
      else input.checked = !input.checked;
    });

    optionContainer.addEventListener("mouseenter", () => optionContainer.style.backgroundColor = "#f8fafc");
    optionContainer.addEventListener("mouseleave", () => optionContainer.style.backgroundColor = "transparent");

    optionContainer.appendChild(input);
    optionContainer.appendChild(label);
    mainContainer.appendChild(optionContainer);
  });

  const validateButton = createEl("button", { type: "button", id: "validate-button", text: "Submit Answer" });
  validateButton.style.marginTop = "20px";
  validateButton.style.width = "100%";
  mainContainer.appendChild(validateButton);

  function getSelectedIndices() {
    const selectedInputs = mainContainer.querySelectorAll(`input[name="q${index}"]:checked`);
    return selectedInputs && selectedInputs.length ? Array.from(selectedInputs).map((input) => Number(input.value)) : [];
  }

  function focusFirstInput() {
    setTimeout(() => {
      const firstInput = mainContainer.querySelector(`input[name="q${index}"]`);
      if (firstInput) firstInput.focus();
    }, 0);
  }

  return { validateButton, getSelectedIndices, focusFirstInput };
}

/* --------- show result UI (corrections, score, actions) --------- */
export function showResultUI({
  score = 0,
  total = 0,
  userSelections = [],
  activeQuestions = [],
  elapsedMs = 0,
  onRestart,
}) {
  setTimerVisible(false);
  clearContainer();

  // Package result data (onRestart kept so restart can work)
  const resultData = { score, total, userSelections, activeQuestions, elapsedMs, onRestart };

  // Tell stats module about the last result (so it can provide a back link)
  import("./stats.js").then((module) => {
    if (typeof module.setResultData === "function") module.setResultData(resultData);
  });

  pageTitle.textContent = "Quiz Terminé !";
  pageDescription.textContent = `Vous avez complété le quiz avec un score de ${score}/${total}`;

  const resultContainer = createEl("div", { className: "result-container" });

  const scoreCard = createScoreCard(score, total, elapsedMs);
  resultContainer.appendChild(scoreCard);

  const message = createPerformanceMessage(score, total);
  resultContainer.appendChild(message);

  const buttonsContainer = createActionButtons(onRestart, resultData);
  resultContainer.appendChild(buttonsContainer);

  const correctionsSection = createCorrectionsSection(activeQuestions, userSelections);
  resultContainer.appendChild(correctionsSection);

  mainContainer.appendChild(resultContainer);
}

/* ----- score card + helpers ----- */
function createScoreCard(score, total, elapsedMs) {
  const scoreCard = createEl("div", { className: "score-card" });
  const scoreCircle = createEl("div", { className: "score-circle" });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const scorePercentage = createEl("div", { className: "score-percentage", text: `${percentage}%` });
  const scoreFraction = createEl("div", { className: "score-fraction", text: `${score}/${total}` });
  scoreCircle.appendChild(scorePercentage);
  scoreCircle.appendChild(scoreFraction);

  const scoreDetails = createEl("div", { className: "score-details" });
  const timeTaken = createEl("div", { className: "time-taken", text: `⏱️ Temps: ${formatSeconds(elapsedMs)}` });
  const accuracy = createEl("div", { className: "accuracy", text: `🎯 Précision: ${percentage}%` });
  scoreDetails.appendChild(timeTaken);
  scoreDetails.appendChild(accuracy);

  scoreCard.appendChild(scoreCircle);
  scoreCard.appendChild(scoreDetails);
  return scoreCard;
}

function createPerformanceMessage(score, total) {
  const messageDiv = createEl("div", { className: "performance-message" });
  const percentage = total > 0 ? (score / total) * 100 : 0;
  let messageText = "", messageType = "";
  if (percentage < 50) { messageText = "📚 Continuez à réviser, vous progresserez !"; messageType = "average"; }
  else if (percentage < 75) { messageText = "👍 Bon travail, vous pouvez encore vous améliorer !"; messageType = "good"; }
  else if (percentage < 90) { messageText = "🎉 Excellent travail !"; messageType = "excellent"; }
  else { messageText = "🏆 Performance exceptionnelle !"; messageType = "outstanding"; }
  messageDiv.textContent = messageText;
  messageDiv.classList.add(messageType);
  return messageDiv;
}

/* Build action buttons. Pass resultData so stats can link back. */
function createActionButtons(onRestart, resultData = {}) {
  const buttonsContainer = createEl("div", { className: "action-buttons" });

  const restartBtn = createEl("button", { className: "btn btn-primary", text: "🔄 Recommencer le Quiz" });
  const statsBtn = createEl("button", { className: "btn btn-secondary", text: "📊 Voir les Statistiques" });
  const exportBtn = createEl("button", { className: "btn btn-outline", text: "📄 Exporter en PDF" });

  buttonsContainer.appendChild(restartBtn);
  buttonsContainer.appendChild(statsBtn);
  buttonsContainer.appendChild(exportBtn);

  restartBtn.addEventListener("click", () => { if (typeof onRestart === "function") onRestart(); });

  // set result data then show stats inside the same #container
  statsBtn.addEventListener("click", () => {
    import("./stats.js").then((module) => {
      if (typeof module.setResultData === "function") module.setResultData(resultData);
      if (typeof module.statesUI === "function") module.statesUI();
    });
  });

  // Export PDF: generate PDF from a cloned result container without action buttons
  exportBtn.addEventListener("click", async () => {
    try {
      const resultBlock = document.querySelector(".result-container");
      // if (!resultBlock) { alert("Rien à exporter."); return; }

      // clone and remove interactive bits
      const clone = resultBlock.cloneNode(true);
      const actions = clone.querySelector(".action-buttons");
      if (actions) actions.remove();

      // place a temporary off-screen wrapper (html2pdf needs the node in DOM)
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const options = {
        margin: 0.5,
        filename: `resultat-quiz-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };

      if (!window.html2pdf) { alert("La bibliothèque html2pdf n'est pas chargée."); document.body.removeChild(wrapper); return; }
      await window.html2pdf().set(options).from(wrapper).save();
      document.body.removeChild(wrapper);
    } catch (err) {
      console.error("Erreur export PDF:", err);
      alert("Erreur lors de l'export PDF.");
    }
  });

  return buttonsContainer;
}

/* Corrections UI */
function createCorrectionsSection(activeQuestions = [], userSelections = []) {
  const section = createEl("section", { className: "corrections-section" });
  const header = createEl("h3", { className: "corrections-header", text: "🔍 Correction des Réponses" });
  section.appendChild(header);
  const correctionsList = createEl("div", { className: "corrections-list" });

  (activeQuestions || []).forEach((question, index) => {
    const questionCard = createQuestionCorrection(question, userSelections, index);
    correctionsList.appendChild(questionCard);
  });

  section.appendChild(correctionsList);
  return section;
}

/* Individual question correction card — SAFE: textContent only */
function createQuestionCorrection(question, userSelections, questionIndex) {
  const card = createEl("div", { className: "question-correction" });

  const userAnswers = getUserAnswers(question, userSelections, questionIndex);
  const correctAnswers = getCorrectAnswers(question);
  const isCorrect = checkIfCorrect(question, userSelections, questionIndex);

  const questionHeader = createEl("div", { className: "question-header" });
  const questionNumber = createEl("span", { className: "question-number", text: `Question ${questionIndex + 1}` });
  const statusBadge = createEl("span", { className: `status-badge ${isCorrect ? "correct" : "incorrect"}`, text: isCorrect ? "✅ Correct" : "❌ Incorrect" });
  questionHeader.appendChild(questionNumber);
  questionHeader.appendChild(statusBadge);

  const questionText = createEl("div", { className: "question-text", text: question.question });

  const answersComparison = createEl("div", { className: "answers-comparison" });
  const userAnswerRow = createEl("div", { className: "answer-row" });
  const userLabel = createEl("span", { className: "answer-label", text: "Votre réponse:" });
  const userAnswerSpan = createEl("span", { className: `user-answer ${isCorrect ? "correct" : "incorrect"}`, text: userAnswers });
  userAnswerRow.appendChild(userLabel);
  userAnswerRow.appendChild(userAnswerSpan);
  answersComparison.appendChild(userAnswerRow);

  if (!isCorrect) {
    const correctAnswerRow = createEl("div", { className: "answer-row" });
    const correctLabel = createEl("span", { className: "answer-label", text: "Réponse correcte:" });
    const correctAnswerSpan = createEl("span", { className: "correct-answer", text: correctAnswers });
    correctAnswerRow.appendChild(correctLabel);
    correctAnswerRow.appendChild(correctAnswerSpan);
    answersComparison.appendChild(correctAnswerRow);
  }

  card.appendChild(questionHeader);
  card.appendChild(questionText);
  card.appendChild(answersComparison);
  return card;
}

/* Helper functions for corrections (safe — return text) */
function getUserAnswers(question, userSelections = [], questionIndex) {
  const userIndices = (userSelections && userSelections[questionIndex]) || [];
  if (!Array.isArray(userIndices) || userIndices.length === 0) return "Aucune réponse sélectionnée";
  return userIndices.map((idx) => (question.options && question.options[idx] ? question.options[idx] : "Réponse invalide")).join(", ");
}
function getCorrectAnswers(question) {
  const correctIndices = (question.correct || []).map(Number);
  if (!Array.isArray(correctIndices) || correctIndices.length === 0) return "Aucune réponse correcte définie";
  return correctIndices.map((idx) => (question.options && question.options[idx] ? question.options[idx] : "Index invalide")).join(", ");
}
function checkIfCorrect(question, userSelections = [], questionIndex) {
  const userIndices = (userSelections && userSelections[questionIndex]) || [];
  const correctIndices = (question.correct || []).map(Number);
  if (!Array.isArray(userIndices)) return false;
  if (userIndices.length !== correctIndices.length) return false;
  return userIndices.every((idx) => correctIndices.includes(Number(idx))) && correctIndices.every((idx) => userIndices.map(Number).includes(Number(idx)));
}

/* Visual feedback function exported for other modules to use */
let feedbackTimeout = null;
export function visualFeedback(questionIndex, selectedIndices = [], correctIndices = [], onComplete) {
  const DELAY_MS = 1000;
  if (feedbackTimeout) { clearTimeout(feedbackTimeout); feedbackTimeout = null; }

  selectedIndices = Array.isArray(selectedIndices) ? selectedIndices.map(Number) : [];
  correctIndices = Array.isArray(correctIndices) ? correctIndices.map(Number) : [];

  const validateButton = document.getElementById("validate-button");
  if (validateButton) { validateButton.disabled = true; validateButton.style.display = "none"; }
  const inputs = Array.from(document.querySelectorAll(`input[name="q${questionIndex}"]`));
  inputs.forEach((i) => (i.disabled = true));

  const prevStatus = document.querySelector(".feedback-status");
  if (prevStatus && prevStatus.parentNode) prevStatus.parentNode.removeChild(prevStatus);

  const getLabel = (i) => document.querySelector(`label[for="q${questionIndex}_opt${i}"]`);

  selectedIndices.forEach((i) => {
    const label = getLabel(i);
    if (!label) return;
    if (correctIndices.includes(i)) label.classList.add("selected-correct");
    else label.classList.add("selected-wrong");
  });

  const unselectedCorrect = correctIndices.filter((i) => !selectedIndices.includes(i));
  unselectedCorrect.forEach((i) => {
    const label = getLabel(i);
    if (!label) return;
    label.classList.add("correct-reveal");
  });

  const status = document.createElement("div");
  status.className = "feedback-status";
  const selSorted = [...selectedIndices].sort((a, b) => a - b);
  const corrSorted = [...correctIndices].sort((a, b) => a - b);
  const fullyCorrect = selSorted.length === corrSorted.length && selSorted.every((v, i) => v === corrSorted[i]);

  status.textContent = fullyCorrect ? "✅ Correct." : `❌ Incorrect (${selectedIndices.filter((i) => correctIndices.includes(i)).length} / ${correctIndices.length})`;

  const para = document.querySelector("p");
  if (para && para.parentNode) para.parentNode.insertBefore(status, para.nextSibling);
  else mainContainer.prepend(status);

  feedbackTimeout = setTimeout(() => {
    selectedIndices.forEach((i) => { const label = getLabel(i); if (label) label.classList.remove("selected-correct", "selected-wrong"); });
    unselectedCorrect.forEach((i) => { const label = getLabel(i); if (label) label.classList.remove("correct-reveal"); });
    const s = document.querySelector(".feedback-status");
    if (s && s.parentNode) s.parentNode.removeChild(s);
    feedbackTimeout = null;
    if (typeof onComplete === "function") { try { onComplete(); } catch (e) { console.error("visualFeedback onComplete error:", e); } }
    else {
      inputs.forEach((i) => (i.disabled = false));
      if (validateButton) { validateButton.disabled = false; validateButton.style.display = ""; }
    }
  }, DELAY_MS);
}
// Make sure this is in uiController.js (exported)
export function showThemeSelection({ themes = [], onThemeSelect } = {}) {
  if (!mainContainer) return;

  // Hide the global start button if present
  const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "none";

  // Update header
  pageTitle.textContent = "Choose a theme";
  pageDescription.textContent = "Pick a theme to start the quiz.";

  // Clear only the quiz area (preserve overall page chrome)
  clearContainer();

  // Grid container for theme cards
  const grid = createEl("div", { className: "theme-grid" });

  themes.forEach((t) => {
    // Card wrapper
    const card = createEl("div", { className: "theme-card" });
    // store id on dataset so it's accessible and semantic
    card.dataset.theme = t.id;

    // icon or image
    let iconNode;
    if (t.img) {
      iconNode = createEl("img", { className: "theme-icon" });
      iconNode.src = t.img;
      iconNode.alt = t.label || t.id;
    } else {
      iconNode = createEl("div", { className: "theme-icon", text: t.icon || "❓" });
    }

    const label = createEl("div", { className: "theme-label", text: t.label || t.id });

    card.appendChild(iconNode);
    card.appendChild(label);

    // click behaviour: select visually, then call callback
    card.addEventListener("click", () => {
      // toggle selection class (visual only)
      grid.querySelectorAll(".theme-card").forEach((n) => n.classList.remove("selected-theme"));
      card.classList.add("selected-theme");

      // small delay for UX, then call callback
      setTimeout(() => {
        if (typeof onThemeSelect === "function") onThemeSelect(t.id);
      }, 120);
    });

    grid.appendChild(card);
  });

  mainContainer.appendChild(grid);
}
