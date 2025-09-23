import { createEl, formatSeconds } from "./utils.js";

const title = document.querySelector("h1");
const para = document.querySelector("p");
const container = document.getElementById("container");

let timerElement = document.getElementById("timer");
if (!timerElement) {
  timerElement = createEl("div", { id: "timer" });
  timerElement.style.marginBottom = "8px";
  const header = document.querySelector("h1");
  if (header && header.parentNode) header.insertAdjacentElement("afterend", timerElement);
  else if (container) container.prepend(timerElement);
}
timerElement.classList.remove("visible", "warning", "expired");

export function updateTimerText(text) {
  if (!timerElement) return;
  timerElement.textContent = text;
}


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

export function clearContainer() {
  if (container) container.innerHTML = "";
}


export function showChoiceLevelName({ questionsSource = [], onStart, selectedTheme = null }) {
  if (!container) return;

  const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "none";

  title.textContent = "JSQuizStarter";
  para.textContent = "Please enter a username and choose a level before starting.";
  container.innerHTML = "";
  const storedName = localStorage.getItem("username") || "";

  if (selectedTheme) {
    const themeNote = createEl('div', { text: `Theme: ${selectedTheme}` });
    themeNote.style.fontWeight = '700';
    themeNote.style.marginBottom = '8px';
    container.appendChild(themeNote);
  }

  const nameLabel = createEl("label", { text: "Username" });
  nameLabel.style.display = "block";
  nameLabel.style.marginBottom = "6px";

  const usernameInput = createEl("input", { type: "text", name: "username", placeholder: "Your name" });
  usernameInput.value = storedName;
  usernameInput.style.padding = "8px";
  usernameInput.style.borderRadius = "6px";
  usernameInput.style.border = "1px solid #ddd";
  usernameInput.style.display = "block";
  usernameInput.style.width = "100%";
  usernameInput.style.boxSizing = "border-box";
  usernameInput.style.marginBottom = "12px";

  container.appendChild(nameLabel);
  container.appendChild(usernameInput);

   const levels = ["easy", "medium", "hard"];

  const selectLabel = createEl("label", { text: "Choose level" });
  selectLabel.style.display = "block";
  selectLabel.style.margin = "8px 0 6px 0";
  container.appendChild(selectLabel);

  const select = createEl("select");
  select.style.padding = "8px";
  select.style.borderRadius = "6px";
  select.style.border = "1px solid #ddd";
  select.style.display = "block";
  select.style.width = "100%";
  select.style.boxSizing = "border-box";

  const defaultOption = createEl("option", { value: "", text: "Select level" });
  select.appendChild(defaultOption);

  levels.forEach((l) => {
    const opt = createEl("option", { value: l, text: l });
    select.appendChild(opt);
  });

  container.appendChild(selectLabel);
  container.appendChild(select);

  const controls = createEl("div");
  controls.style.marginTop = "14px";
  controls.style.display = "flex";
  controls.style.gap = "8px";

  const btnStart = createEl("button", { type: "button", text: "Start" });
  btnStart.style.flex = "1";
  const btnCancel = createEl("button", { type: "button", text: "Cancel" });
  btnCancel.className = "secondary";
  btnCancel.style.flex = "1";

  controls.appendChild(btnStart);
  controls.appendChild(btnCancel);
  container.appendChild(controls);

  function cleanup() {
    btnStart.removeEventListener("click", startHandler);
    btnCancel.removeEventListener("click", cancelHandler);
    usernameInput.removeEventListener("keydown", keyHandler);
    select.removeEventListener("keydown", keyHandler);
  }

  function startHandler() {
    const username = (usernameInput.value || "").trim();
    const selectedLevel = select.value;
    if (!username) {
      alert("Please enter your name before starting.");
      usernameInput.focus();
      return;
    }
    if (!selectedLevel) {
      alert("Choose a level please!");
      select.focus();
      return;
    }
    cleanup();
    if (typeof onStart === "function") onStart({ username, level: selectedLevel, theme: selectedTheme });
  }

  function cancelHandler() {
    cleanup();
    title.textContent = "JSQuizStarter";
    para.textContent = "Press Start to begin the quiz.";
    container.innerHTML = "";
    if (startBtn) startBtn.style.display = "";
  }

  function keyHandler(e) {
    if (e.key === "Enter") startHandler();
  }

  btnStart.addEventListener("click", startHandler);
  btnCancel.addEventListener("click", cancelHandler);
  usernameInput.addEventListener("keydown", keyHandler);
  select.addEventListener("keydown", keyHandler);

  usernameInput.focus();
}

export function renderQuestionUI({ q, index, total }) {
  if (!container) return {};
  title.textContent = `Question ${index + 1} / ${total}`;
  para.textContent = q.question;
  container.innerHTML = "";
  setTimerState("");
  setTimerVisible(true);

  const multiple = (q.correct || []).length > 1;
  q.options.forEach((optText, i) => {
    const input = createEl("input", {
      type: multiple ? "checkbox" : "radio",
      id: `q${index}_opt${i}`,
      name: `q${index}`,
      value: i,
    });
    const label = createEl("label", { for: `q${index}_opt${i}`, text: optText });
    container.appendChild(input);
    container.appendChild(label);
    container.appendChild(createEl("br"));
  });

  const validateButton = createEl("button", { type: "button", id: "validate-button", text: "Validate" });
  container.appendChild(validateButton);

  function getSelectedIndices() {
    const selectedNodes = container.querySelectorAll(`input[name="q${index}"]:checked`);
    return selectedNodes && selectedNodes.length ? Array.from(selectedNodes).map((n) => Number(n.value)) : [];
  }

  function focusFirstInput() {
    setTimeout(() => {
      const firstInput = container.querySelector(`input[name="q${index}"]`);
      if (firstInput) firstInput.focus();
    }, 0);
  }

  return { validateButton, getSelectedIndices, focusFirstInput };
}


export function showResultUI({ score = 0, total = 0, userSelections = [], activeQuestions = [], elapsedMs = 0, onRestart }) {
  setTimerVisible(false);
  clearContainer();
  title.textContent = "Quiz terminé";
  para.textContent = `Score: ${score} / ${total}`;

  const message = createEl("p", { text: score < Math.ceil(total / 2) ? "Revise your knowledge" : score === Math.ceil(total / 2) ? "Could be better" : "VERY GOOD" });
  message.style.fontWeight = "600";
  message.style.marginTop = "6px";
  container.appendChild(message);

  const timeText = createEl("p", { text: `You took: ${formatSeconds(elapsedMs)}` });
  timeText.style.marginTop = "6px";
  container.appendChild(timeText);

  const corrHeader = createEl("h3", { text: "Corrections" });
  corrHeader.style.marginTop = "12px";
  corrHeader.style.fontSize = "16px";
  corrHeader.style.fontWeight = "700";
  container.appendChild(corrHeader);

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
    const userText = userIdx.length > 0 ? userIdx.map((idx) => (typeof q.options[idx] !== "undefined" ? q.options[idx] : "(invalid selection)")).join(", ") : "(no selection)";
    const userLine = createEl("div");
    userLine.appendChild(createEl("em", { text: "Your answer: " }));
    userLine.appendChild(createEl("span", { text: userText }));
    userLine.style.marginBottom = "4px";
    qDiv.appendChild(userLine);

    const correctIdx = (q.correct || []).map(Number);
    const correctText = correctIdx.length > 0 ? correctIdx.map((idx) => (typeof q.options[idx] !== "undefined" ? q.options[idx] : "(invalid index)")).join(", ") : "(none)";
    const correctLine = createEl("div");
    correctLine.appendChild(createEl("em", { text: "Correct: " }));
    correctLine.appendChild(createEl("span", { text: correctText }));
    correctLine.style.marginBottom = "6px";
    qDiv.appendChild(correctLine);

    const wasCorrect = !!(q._wasCorrect);
    const okLine = createEl("div", { text: wasCorrect ? "✅ Correct" : "❌ Incorrect" });
    okLine.style.color = wasCorrect ? "#065f46" : "#991b1b";
    okLine.style.fontWeight = "700";
    qDiv.appendChild(okLine);

    correctionsWrap.appendChild(qDiv);
  });

  container.appendChild(correctionsWrap);

  const controls = createEl("div");
  controls.style.marginTop = "12px";
  const restart = createEl("button", { type: "button", id: "restart", text: "Restart the quiz" });
  restart.style.margin = "14px";
  const exportPDF = createEl("button", { type: "button", id: "export-pdf", text: "Export as PDF" });
  controls.appendChild(restart);
  controls.appendChild(exportPDF);
  container.appendChild(controls);

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
      await html2pdf().set(opt).from(document.body).save();
    } catch (e) {
      console.error("pdf generation failed", e);
    } finally {
      restart.style.display = "inline-block";
      exportPDF.style.display = "inline-block";
    }
  });
}


export function showThemeSelection({ themes = [], onThemeSelect }) {
  if (!container) return;
   const startBtn = document.getElementById("start-quiz");
  if (startBtn) startBtn.style.display = "none";
  title.textContent = "Choose a theme";
  para.textContent = "Pick a theme to start the quiz.";
  container.innerHTML = "";

  const grid = createEl("div");
  grid.className = "theme-grid";

  themes.forEach(t => {
    const card = createEl("div", { class: "theme-card", "data-theme": t.id });
    const img = t.img
      ? createEl("img", { src: t.img, alt: t.label, class: "theme-icon" })
      : createEl("div", { text: t.icon || "❓", class: "theme-icon" });
    const label = createEl("div", { text: t.label, class: "theme-label" });
    card.appendChild(img);
    card.appendChild(label);

    card.addEventListener("click", () => {
      grid.querySelectorAll(".theme-card").forEach(n => n.classList.remove("selected-theme"));
      card.classList.add("selected-theme");
      setTimeout(() => {
        if (typeof onThemeSelect === "function") onThemeSelect(t.id);
      }, 150);
    });

    grid.appendChild(card);
  });

  container.appendChild(grid);
}