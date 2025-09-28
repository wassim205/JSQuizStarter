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
    // wrapper for the option (minimal inline styles; prefer CSS)
    const optionContainer = createEl("div");
    optionContainer.className = "option-container";

    // label wraps input + text so full box is clickable and CSS classes apply directly to label
    const label = createEl("label", { for: `q${index}_opt${optionIndex}` });
    label.className = "option-label";

    const input = createEl("input", {
      type: inputType,
      id: `q${index}_opt${optionIndex}`,
      name: `q${index}`,
      value: optionIndex,
    });

    const span = createEl("span", { text: optionText });
    // append input then text (input inside label ensures clicking works without extra listeners)
    label.appendChild(input);
    label.appendChild(span);

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
function escapeHTML(str) {
  if (str === null || typeof str === "undefined") return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAnswerHTML(text) {
  const raw = String(text ?? "");
  const looksLikeCode = /\n/.test(raw) || /<[^>]+>/.test(raw) || raw.trim().startsWith("<");
  const escaped = escapeHTML(raw);
  if (looksLikeCode) {
    return `<pre><code>${escaped}</code></pre>`;
  }
  // short inline answers
  return `<span>${escaped}</span>`;
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

  // Update header
  pageTitle.textContent = "Quiz Terminé !";
  pageDescription.textContent = `Vous avez complété le quiz avec un score de ${score}/${total}`;

  // Build result container
  const resultContainer = createEl("div");
  resultContainer.className = "result-container";

  // Score summary
  const scoreCard = createScoreCard(score, total, elapsedMs);
  resultContainer.appendChild(scoreCard);

  // Performance message
  const message = createPerformanceMessage(score, total);
  resultContainer.appendChild(message);

  // Action buttons (restart, stats, export)
  const buttonsContainer = createActionButtons(onRestart, resultContainer);
  resultContainer.appendChild(buttonsContainer);

  // Corrections
  const correctionsSection = createCorrectionsSection(activeQuestions, userSelections);
  resultContainer.appendChild(correctionsSection);

  mainContainer.appendChild(resultContainer);
}

// ---------- Score card ----------
function createScoreCard(score, total, elapsedMs) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const scoreCard = createEl("div");
  scoreCard.className = "score-card";

  // Use innerHTML for richer layout
  scoreCard.innerHTML = `
    <div class="score-circle">
      <div class="score-percentage">${percentage}%</div>
      <div class="score-fraction">${score}/${total}</div>
    </div>
    <div class="score-details">
      <div class="time-taken">⏱️ Temps: ${formatSeconds(elapsedMs)}</div>
      <div class="accuracy">🎯 Précision: ${percentage}%</div>
    </div>
  `;
  return scoreCard;
}

// ---------- Performance message ----------
function createPerformanceMessage(score, total) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  let messageText = "", messageType = "";

  if (percentage < 50) {
    messageText = "📚 Continuez à réviser, vous progresserez !";
    messageType = "average";
  } else if (percentage < 75) {
    messageText = "👍 Bon travail, vous pouvez encore vous améliorer !";
    messageType = "good";
  } else if (percentage < 90) {
    messageText = "🎉 Excellent travail !";
    messageType = "excellent";
  } else {
    messageText = "🏆 Performance exceptionnelle !";
    messageType = "outstanding";
  }

  const messageDiv = createEl("div");
  messageDiv.className = `performance-message ${messageType}`;
  messageDiv.textContent = messageText;
  return messageDiv;
}

// ---------- Action buttons (with robust PDF export) ----------
function createActionButtons(onRestart, resultContainerNode) {
  const buttonsContainer = createEl("div");
  buttonsContainer.className = "action-buttons";

  const restartBtn = createEl("button");
  restartBtn.className = "btn btn-primary";
  restartBtn.textContent = "🔄 Recommencer le Quiz";

  const statsBtn = createEl("button");
  statsBtn.className = "btn btn-secondary";
  statsBtn.textContent = "📊 Voir les Statistiques";

  const exportBtn = createEl("button");
  exportBtn.className = "btn btn-outline";
  exportBtn.textContent = "📄 Exporter en PDF";

  buttonsContainer.appendChild(restartBtn);
  buttonsContainer.appendChild(statsBtn);
  buttonsContainer.appendChild(exportBtn);

  restartBtn.addEventListener("click", () => {
    if (typeof onRestart === "function") onRestart();
  });

  statsBtn.addEventListener("click", () => {
    import("./stats.js").then((module) => {
      if (typeof module.setResultData === "function") module.setResultData({
        score: 0, total: 0 // optional; your stats module may overwrite with real data
      });
      if (typeof module.statesUI === "function") module.statesUI();
    });
  });

  exportBtn.addEventListener("click", async () => {
    await handlePDFExport(resultContainerNode, buttonsContainer);
  });

  return buttonsContainer;
}

// ---------- PDF export (robust) ----------
async function handlePDFExport(resultContainerNode, buttonsContainer) {
  // Hide local action buttons while exporting
  const localButtons = buttonsContainer.querySelectorAll("button");
  localButtons.forEach((b) => (b.style.display = "none"));

  try {
    const options = {
      margin: 0.5,
      filename: `resultat-quiz-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
    };

    // Select the actual node to print (prefer the .result-container)
    const node = document.querySelector(".result-container") || resultContainerNode || document.body;

    if (window && typeof window.html2pdf === "function") {
      // Clone node and append off-screen so layout stays stable
      const clone = node.cloneNode(true);
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await window.html2pdf().set(options).from(clone).save();
      document.body.removeChild(wrapper);
    } else {
      // fallback: open a new window and call print (safe fallback)
      const w = window.open("", "_blank");
      if (!w) throw new Error("Unable to open print window (popup blocker?)");
      const styleNodes = Array.from(document.querySelectorAll("style, link[rel='stylesheet']")).map((n) => n.outerHTML).join("\n");
      w.document.open();
      w.document.write(`<!doctype html><html><head><meta charset="utf-8">${styleNodes}</head><body>${node.outerHTML}</body></html>`);
      w.document.close();
      w.focus();
      w.print();
      // we won't auto-close to allow the user to confirm; user closes manually
    }
  } catch (err) {
    console.error("Erreur lors de l'export PDF:", err);
    alert("Erreur lors de l'export PDF. Essayez d'installer/charger html2pdf ou utilisez l'impression du navigateur.");
  } finally {
    // restore buttons
    localButtons.forEach((b) => (b.style.display = "inline-block"));
  }
}

// ---------- Corrections & question card (uses innerHTML but safe inserts) ----------
function createCorrectionsSection(activeQuestions = [], userSelections = []) {
  const section = createEl("section");
  section.className = "corrections-section";

  const header = createEl("h3");
  header.className = "corrections-header";
  header.textContent = "🔍 Correction des Réponses";
  section.appendChild(header);

  const list = createEl("div");
  list.className = "corrections-list";

  (activeQuestions || []).forEach((q, i) => {
    const card = createQuestionCorrection(q, userSelections, i);
    list.appendChild(card);
  });

  section.appendChild(list);
  return section;
}

function createQuestionCorrection(question, userSelections, questionIndex) {
  const card = createEl("div");
  card.className = "question-correction";

  const userAnswersHTML = getUserAnswersHTML(question, userSelections, questionIndex);
  const correctAnswersHTML = getCorrectAnswersHTML(question);
  const isCorrect = checkIfCorrect(question, userSelections, questionIndex);

  // Build innerHTML but using **escaped** strings above
  card.innerHTML = `
    <div class="question-header">
      <span class="question-number">Question ${questionIndex + 1}</span>
      <span class="status-badge ${isCorrect ? "correct" : "incorrect"}">${isCorrect ? "✅ Correct" : "❌ Incorrect"}</span>
    </div>
    <div class="question-text">${escapeHTML(question.question)}</div>
    <div class="answers-comparison">
      <div class="answer-row">
        <span class="answer-label">Votre réponse:</span>
        <span class="user-answer ${isCorrect ? "correct" : "incorrect"}">${userAnswersHTML}</span>
      </div>
      ${!isCorrect ? `<div class="answer-row">
        <span class="answer-label">Réponse correcte:</span>
        <span class="correct-answer">${correctAnswersHTML}</span>
      </div>` : ""}
    </div>
  `.trim();

  return card;
}

// ---------- Helpers that return safe HTML (not raw text) ----------
function getUserAnswersHTML(question, userSelections = [], questionIndex) {
  const userIndices = (userSelections && userSelections[questionIndex]) || [];
  if (!Array.isArray(userIndices) || userIndices.length === 0) {
    return `<em>${escapeHTML("Aucune réponse sélectionnée")}</em>`;
  }
  return userIndices
    .map((idx) => {
      const text = (question.options && question.options[idx] != null) ? question.options[idx] : "(invalid selection)";
      return renderAnswerHTML(text);
    })
    .join("<span>, </span>");
}

function getCorrectAnswersHTML(question) {
  const correctIndices = (question.correct || []).map(Number);
  if (!Array.isArray(correctIndices) || correctIndices.length === 0) {
    return `<em>${escapeHTML("Aucune réponse correcte définie")}</em>`;
  }
  return correctIndices
    .map((idx) => {
      const text = (question.options && question.options[idx] != null) ? question.options[idx] : "(invalid index)";
      return renderAnswerHTML(text);
    })
    .join("<span>, </span>");
}

function checkIfCorrect(question, userSelections = [], questionIndex) {
  const userIndices = (userSelections && userSelections[questionIndex]) || [];
  const correctIndices = (question.correct || []).map(Number);
  if (!Array.isArray(userIndices)) return false;
  if (userIndices.length !== correctIndices.length) return false;
  return userIndices.every((idx) => correctIndices.includes(Number(idx))) &&
         correctIndices.every((idx) => userIndices.map(Number).includes(Number(idx)));
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

  // Grid container for theme cards (created plainly, then class assigned)
  const grid = createEl("div");
  grid.className = "theme-grid";

  themes.forEach((t) => {
    // Card wrapper — explicit class + dataset
    const card = createEl("div");
    card.className = "theme-card";
    if (t.id) card.dataset.theme = t.id;

    // icon or image node (explicit attributes)
    let iconNode;
    if (t.img) {
      iconNode = createEl("img");
      iconNode.className = "theme-icon";
      iconNode.src = t.img;
      iconNode.alt = t.label || t.id || "theme";
    } else {
      iconNode = createEl("div");
      iconNode.className = "theme-icon";
      iconNode.textContent = t.icon || "❓";
    }

    const label = createEl("div");
    label.className = "theme-label";
    label.textContent = t.label || t.id || "Theme";

    card.appendChild(iconNode);
    card.appendChild(label);

    // click behaviour: select visually, then call callback
    card.addEventListener("click", () => {
      // remove selection from other cards in this grid
      grid.querySelectorAll(".theme-card").forEach((n) => n.classList.remove("selected-theme"));
      card.classList.add("selected-theme");

      // Small UX delay to let the outline/hover feel happen, then call callback
      setTimeout(() => {
        if (typeof onThemeSelect === "function") onThemeSelect(t.id);
      }, 150);
    });

    grid.appendChild(card);
  });

  mainContainer.appendChild(grid);
}
