import { createEl, formatSeconds } from "./utils.js";

const pageTitle = document.querySelector("h1");
const pageDescription = document.querySelector("p");
const mainContainer = document.getElementById("container");

let timerElement = document.getElementById("timer");
if (!timerElement) {
  timerElement = createEl("div", { id: "timer" });
  timerElement.style.marginBottom = "8px";

  const header = document.querySelector("h1");
  if (header && header.parentNode) {
    header.insertAdjacentElement("afterend", timerElement);
  } else if (mainContainer) {
    mainContainer.prepend(timerElement);
  }
}

timerElement.classList.remove("visible", "warning", "expired");

/* Updates the timer display text */
export function updateTimerText(text) {
  if (!timerElement) return;
  timerElement.textContent = text;
}

/* Sets the timer visual state (normal, warning, expired) */
export function setTimerState(state) {
  if (!timerElement) return;

  timerElement.classList.remove("warning", "expired");

  if (state === "warning") {
    timerElement.classList.add("warning");
  } else if (state === "expired") {
    timerElement.classList.add("expired");
  }
}

/* Shows or hides the timer element */
export function setTimerVisible(visible = true) {
  if (!timerElement) return;
  timerElement.classList.toggle("visible", !!visible);
}

/* Clears the main container content */
export function clearContainer() {
  if (mainContainer) {
    mainContainer.innerHTML = "";
  }
}

/* Shows the username and level selection form */
export function showChoiceLevelName({ onStart, selectedTheme = null }) {
  if (!mainContainer) return;

  const startButton = document.getElementById("start-quiz");
  if (startButton) {
    startButton.style.display = "none";
  }

  pageTitle.textContent = "JSQuizStarter";
  pageDescription.textContent =
    "Please enter your username and choose a difficulty level.";
  mainContainer.innerHTML = "";

  const storedUsername = localStorage.getItem("username") || "";

  if (selectedTheme) {
    const themeDisplay = createEl("div", {
      text: `Selected Theme: ${selectedTheme}`,
      class: "theme-display",
    });
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

  const usernameInput = createEl("input", {
    type: "text",
    name: "username",
    placeholder: "Enter your name",
  });
  usernameInput.value = storedUsername;

  mainContainer.appendChild(usernameLabel);
  mainContainer.appendChild(usernameInput);

  const levelOptions = ["easy", "medium", "hard"];
  const levelLabel = createEl("label", { text: "Difficulty Level" });
  levelLabel.style.display = "block";
  levelLabel.style.marginBottom = "8px";
  levelLabel.style.fontWeight = "600";

  const levelSelect = createEl("select");

  const defaultOption = createEl("option", {
    value: "",
    text: "Select difficulty level",
  });
  levelSelect.appendChild(defaultOption);

  levelOptions.forEach((level) => {
    const option = createEl("option", {
      value: level,
      text: level.charAt(0).toUpperCase() + level.slice(1),
    });
    levelSelect.appendChild(option);
  });

  mainContainer.appendChild(levelLabel);
  mainContainer.appendChild(levelSelect);

  const controlsContainer = createEl("div");
  controlsContainer.style.marginTop = "20px";
  controlsContainer.style.display = "flex";
  controlsContainer.style.gap = "12px";
  controlsContainer.style.flexWrap = "wrap";

  const startQuizButton = createEl("button", {
    type: "button",
    text: "Start Quiz",
  });
  startQuizButton.style.flex = "1";
  startQuizButton.style.minWidth = "120px";

  const cancelButton = createEl("button", {
    type: "button",
    text: "Cancel",
  });
  cancelButton.style.flex = "1";
  cancelButton.style.backgroundColor = "#6b7280";
  cancelButton.style.minWidth = "120px";

  controlsContainer.appendChild(startQuizButton);
  controlsContainer.appendChild(cancelButton);
  mainContainer.appendChild(controlsContainer);

  function handleStartQuiz() {
    const username = (usernameInput.value || "").trim();
    const selectedLevel = levelSelect.value;

    if (!username) {
      alert("Please enter your username before starting.");
      usernameInput.focus();
      return;
    }

    if (!selectedLevel) {
      alert("Please choose a difficulty level!");
      levelSelect.focus();
      return;
    }

    cleanup();

    if (typeof onStart === "function") {
      onStart({ username, level: selectedLevel, theme: selectedTheme });
    }
  }

  function handleCancel() {
    cleanup();

    pageTitle.textContent = "JSQuizStarter";
    pageDescription.textContent =
      "Challenge yourself with interactive quizzes that make you stronger!";
    mainContainer.innerHTML = "";

    if (startButton) {
      startButton.style.display = "";
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleStartQuiz();
    }
  }

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

export function renderQuestionUI({ q, index, total }) {
  if (!mainContainer) return {};

  pageTitle.textContent = `Question ${index + 1} of ${total}`;
  pageDescription.textContent = q.question;
  mainContainer.innerHTML = "";

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

    const input = createEl("input", {
      type: inputType,
      id: `q${index}_opt${optionIndex}`,
      name: `q${index}`,
      value: optionIndex,
    });
    input.style.marginRight = "12px";
    input.style.transform = "scale(1.2)";

    const label = createEl("label", {
      for: `q${index}_opt${optionIndex}`,
      text: optionText,
    });
    label.style.cursor = "pointer";
    label.style.flex = "1";
    label.style.margin = "0";
    label.style.padding = "0";
    label.style.border = "none";
    label.style.display = "block";

    optionContainer.addEventListener("mouseenter", () => {
      optionContainer.style.backgroundColor = "#f8fafc";
    });
    optionContainer.addEventListener("mouseleave", () => {
      optionContainer.style.backgroundColor = "transparent";
    });

    optionContainer.appendChild(input);
    optionContainer.appendChild(label);
    mainContainer.appendChild(optionContainer);
  });

  const validateButton = createEl("button", {
    type: "button",
    id: "validate-button",
    text: "Submit Answer",
  });
  validateButton.style.marginTop = "20px";
  validateButton.style.width = "100%";
  mainContainer.appendChild(validateButton);

  function getSelectedIndices() {
    const selectedInputs = mainContainer.querySelectorAll(
      `input[name="q${index}"]:checked`
    );
    return selectedInputs && selectedInputs.length
      ? Array.from(selectedInputs).map((input) => Number(input.value))
      : [];
  }

  function focusFirstInput() {
    setTimeout(() => {
      const firstInput = mainContainer.querySelector(`input[name="q${index}"]`);
      if (firstInput) {
        firstInput.focus();
      }
    }, 0);
  }

  return { validateButton, getSelectedIndices, focusFirstInput };
}

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
  pageTitle.textContent = "Quiz terminé";
  pageDescription.textContent = `Score: ${score} / ${total}`;

  const message = createEl("p", {
    text:
      score < Math.ceil(total / 2)
        ? "Revise your knowledge"
        : score === Math.ceil(total / 2)
        ? "Could be better"
        : "VERY GOOD",
  });
  message.style.fontWeight = "600";
  message.style.marginTop = "6px";
  mainContainer.appendChild(message);

  const timeText = createEl("p", {
    text: `You took: ${formatSeconds(elapsedMs)}`,
  });
  timeText.style.marginTop = "6px";
  mainContainer.appendChild(timeText);

  const corrHeader = createEl("h3", { text: "Corrections" });
  corrHeader.style.marginTop = "12px";
  corrHeader.style.fontSize = "16px";
  corrHeader.style.fontWeight = "700";
  mainContainer.appendChild(corrHeader);

  const correctionsWrap = createEl("div");
  correctionsWrap.style.marginTop = "8px";
  correctionsWrap.style.borderTop = "1px solid #eee";

  activeQuestions.forEach((q, i) => {
    const qDiv = createEl("div");
    qDiv.style.padding = "12px 6px";
    qDiv.style.borderBottom = "1px solid #f2f4f7";
    qDiv.style.background = i % 2 === 0 ? "transparent" : "#fbfdff";

    const qTitle = createEl("div");
    const strong = createEl("strong", { text: `Q${i + 1}: ` });
    const qTextSpan = createEl("span", { text: q.question });
    qTitle.appendChild(strong);
    qTitle.appendChild(qTextSpan);
    qTitle.style.marginBottom = "6px";
    qDiv.appendChild(qTitle);

    const userIdx = (userSelections && userSelections[i]) || [];
    const userText =
      userIdx.length > 0
        ? userIdx
            .map((idx) =>
              typeof q.options[idx] !== "undefined"
                ? q.options[idx]
                : "(invalid selection)"
            )
            .join(", ")
        : "(no selection)";
    const userLine = createEl("div");
    userLine.appendChild(createEl("em", { text: "Your answer: " }));
    userLine.appendChild(createEl("span", { text: userText }));
    userLine.style.marginBottom = "4px";
    qDiv.appendChild(userLine);

    const correctIdx = (q.correct || []).map(Number);
    const correctText =
      correctIdx.length > 0
        ? correctIdx
            .map((idx) =>
              typeof q.options[idx] !== "undefined"
                ? q.options[idx]
                : "(invalid index)"
            )
            .join(", ")
        : "(none)";
    const correctLine = createEl("div");
    correctLine.appendChild(createEl("em", { text: "Correct: " }));
    correctLine.appendChild(createEl("span", { text: correctText }));
    correctLine.style.marginBottom = "6px";
    qDiv.appendChild(correctLine);

    const wasCorrect = !!q._wasCorrect;
    const okLine = createEl("div", {
      text: wasCorrect ? "✅ Correct" : "❌ Incorrect",
    });
    okLine.style.color = wasCorrect ? "#065f46" : "#991b1b";
    okLine.style.fontWeight = "700";
    qDiv.appendChild(okLine);

    correctionsWrap.appendChild(qDiv);
  });

  mainContainer.appendChild(correctionsWrap);

  const controls = createEl("div");
  controls.style.marginTop = "12px";
  const restart = createEl("button", {
    type: "button",
    id: "restart",
    text: "Restart the quiz",
  });
  restart.style.margin = "14px";
  const exportPDF = createEl("button", {
    type: "button",
    id: "export-pdf",
    text: "Export as PDF",
  });
  controls.appendChild(restart);
  controls.appendChild(exportPDF);
  mainContainer.appendChild(controls);

  restart.addEventListener("click", () => {
    if (typeof onRestart === "function") onRestart();
  });

  exportPDF.addEventListener("click", async () => {
    restart.style.display = "none";
    exportPDF.style.display = "none";
    try {
      const opt = {
        margin: 0.5,
        filename: "myGameHistory.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };
      await window.html2pdf().set(opt).from(document.body).save();
    } catch (e) {
      console.error("pdf generation failed", e);
    } finally {
      restart.style.display = "inline-block";
      exportPDF.style.display = "inline-block";
    }
  });
}

export function showThemeSelection({ themes = [], onThemeSelect }) {
  if (!mainContainer) return;
  const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "none";
  pageTitle.textContent = "Choose a theme";
  pageDescription.textContent = "Pick a theme to start the quiz.";
  mainContainer.innerHTML = "";

  const grid = createEl("div");
  grid.className = "theme-grid";

  themes.forEach((t) => {
    const card = createEl("div", { class: "theme-card", "data-theme": t.id });
    const img = t.img
      ? createEl("img", { src: t.img, alt: t.label, class: "theme-icon" })
      : createEl("div", { text: t.icon || "❓", class: "theme-icon" });
    const label = createEl("div", { text: t.label, class: "theme-label" });
    card.appendChild(img);
    card.appendChild(label);

    card.addEventListener("click", () => {
      grid
        .querySelectorAll(".theme-card")
        .forEach((n) => n.classList.remove("selected-theme"));
      card.classList.add("selected-theme");
      setTimeout(() => {
        if (typeof onThemeSelect === "function") onThemeSelect(t.id);
      }, 150);
    });

    grid.appendChild(card);
  });

  mainContainer.appendChild(grid);
}

let feedbackTimeout = null;

export function visualFeedback(
  questionIndex,
  selectedIndices = [],
  correctIndices = [],
  onComplete
) {
  const DELAY_MS = 3000;

  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }

  selectedIndices = (
    Array.isArray(selectedIndices) ? selectedIndices.map(Number) : []
  ).slice();
  correctIndices = (
    Array.isArray(correctIndices) ? correctIndices.map(Number) : []
  ).slice();

  const validateButton = document.getElementById("validate-button");
  if (validateButton) {
    validateButton.disabled = true;
    validateButton.style.display = "none";
  }
  const inputs = Array.from(
    document.querySelectorAll(`input[name="q${questionIndex}"]`)
  );
  inputs.forEach((i) => {
    try {
      i.disabled = true;
    } catch (e) {}
  });

  const prevStatus = document.querySelector(".feedback-status");
  if (prevStatus && prevStatus.parentNode)
    prevStatus.parentNode.removeChild(prevStatus);

  const getLabel = (i) =>
    document.querySelector(`label[for="q${questionIndex}_opt${i}"]`);

  selectedIndices.forEach((i) => {
    const label = getLabel(i);
    if (!label) return;
    if (correctIndices.includes(i)) label.classList.add("selected-correct");
    else label.classList.add("selected-wrong");
  });

  const unselectedCorrect = correctIndices.filter(
    (i) => !selectedIndices.includes(i)
  );
  unselectedCorrect.forEach((i) => {
    const label = getLabel(i);
    if (!label) return;
    label.classList.add("correct-reveal");
  });

  const status = document.createElement("div");
  status.className = "feedback-status";
  const selSorted = [...selectedIndices].sort((a, b) => a - b);
  const corrSorted = [...correctIndices].sort((a, b) => a - b);
  const fullyCorrect =
    selSorted.length === corrSorted.length &&
    selSorted.every((v, i) => v === corrSorted[i]);

  if (fullyCorrect) {
    status.textContent = "✅ Correct.";
  } else {
    const correctCount = selectedIndices.filter((i) =>
      correctIndices.includes(i)
    ).length;
    status.textContent = `❌ Incorrect (${correctCount} / ${correctIndices.length})`;
  }

  const para = document.querySelector("p");
  if (para && para.parentNode)
    para.parentNode.insertBefore(status, para.nextSibling);
  else mainContainer.prepend(status);

  feedbackTimeout = setTimeout(() => {
    selectedIndices.forEach((i) => {
      const label = getLabel(i);
      if (label) label.classList.remove("selected-correct", "selected-wrong");
    });
    unselectedCorrect.forEach((i) => {
      const label = getLabel(i);
      if (label) label.classList.remove("correct-reveal");
    });

    const s = document.querySelector(".feedback-status");
    if (s && s.parentNode) s.parentNode.removeChild(s);

    feedbackTimeout = null;

    if (typeof onComplete === "function") {
      try {
        onComplete();
      } catch (e) {
        console.error("visualFeedback onComplete error:", e);
      }
    } else {
      inputs.forEach((i) => {
        try {
          i.disabled = false;
        } catch (e) {}
      });
      if (validateButton) validateButton.disabled = false;
    }
  }, DELAY_MS);
}
