const QUESTIONS = [
  {
    level: "easy",
    questions: [
      {
        question: "Quelle est la capitale de la France ?",
        options: ["Lyon", "Paris", "Marseille"],
        correct: [1],
      },
      {
        question: "HTML signifie :",
        options: ["HyperText Markup Language", "Home Tool Markup Language"],
        correct: [0],
      },
      {
        question: "Quelle balise HTML correspond à un paragraphe ?",
        options: ["<p>", "<div>", "<span>"],
        correct: [0],
      },
      {
        question: "Le CSS sert à :",
        options: [
          "Structurer le contenu",
          "Styliser le contenu",
          "Programmer la logique",
        ],
        correct: [1],
      },
      {
        question:
          "Quelle couleur obtient-on en mélangeant le rouge et le bleu (synthèse soustractive) ?",
        options: ["Vert", "Violet", "Orange"],
        correct: [1],
      },
      {
        question: "Combien de minutes dans une heure ?",
        options: ["30", "60", "90"],
        correct: [1],
      },
      {
        question: "Quel animal est connu comme le « roi de la jungle » ?",
        options: ["Éléphant", "Lion", "Tigre"],
        correct: [1],
      },
      {
        question: "Quel nombre suit 9 dans la suite naturelle ?",
        options: ["8", "9", "10"],
        correct: [2],
      },
      {
        question: "Quel est l'élément principal de la structure HTML ?",
        options: ["<section>", "<body>", "<script>"],
        correct: [1],
      },
      {
        question:
          "Parmi ces éléments, lesquels sont des balises inline en HTML ?",
        options: ["<div>", "<span>", "<strong>"],
        correct: [1, 2], // multiple correct
      },
    ],
  },

  {
    level: "medium",
    questions: [
      {
        question: "En JavaScript, lequel est un type primitif ?",
        options: ["Object", "Array", "Number"],
        correct: [2],
      },
      {
        question: "Quel opérateur compare sans convertir les types ?",
        options: ["==", "==="],
        correct: [1],
      },
      {
        question:
          "Quelle méthode permet d'ajouter un écouteur d'événement en JS ?",
        options: ["addEventListener", "attachEvent"],
        correct: [0],
      },
      {
        question: "Quelle propriété retourne la longueur d'une chaîne en JS ?",
        options: ["len()", "length", "size()"],
        correct: [1],
      },
      {
        question: "Quel mot-clé déclare une constante en JavaScript ?",
        options: ["let", "var", "const"],
        correct: [2],
      },
      {
        question:
          "Quel(s) mot(s)-clé(s) servent à déclarer une variable en JS moderne ?",
        options: ["var", "let", "const"],
        correct: [1, 2], // multiple correct
      },
      {
        question: "Quelle instruction arrête une boucle immédiatement ?",
        options: ["continue", "break", "return"],
        correct: [1],
      },
      {
        question:
          "Pour sélectionner un élément avec l'id 'app' en JS, on utilise :",
        options: [
          "document.query('#app')",
          "document.getElementById('app')",
          "document.$('#app')",
        ],
        correct: [1],
      },
      {
        question: "Quel est le bon moyen d'ajouter du CSS depuis JS ?",
        options: [
          "element.style.color = 'red';",
          "element.css('color','red');",
        ],
        correct: [0],
      },
      {
        question: "Parmi ces méthodes Array, lesquelles existent en JS ?",
        options: ["map()", "collect()", "filter()"],
        correct: [0, 2], // multiple correct
      },
    ],
  },

  {
    level: "hard",
    questions: [
      {
        question: "Quelle est la sortie de : `console.log(typeof NaN);` ?",
        options: ["'number'", "'NaN'", "'undefined'"],
        correct: [0],
      },
      {
        question: "Quel est le résultat de `[] + []` en JavaScript ?",
        options: ["0", "'' (empty string)", "TypeError"],
        correct: [1],
      },
      {
        question:
          "Quelle(s) propriété(s) CSS sont nécessaires pour centrer un élément flex horizontalement et verticalement ?",
        options: [
          "justify-content et align-items",
          "text-align et vertical-align",
          "margin: 0 auto",
        ],
        correct: [0],
      },
      {
        question:
          "En JS, laquelle de ces déclarations crée une fonction fléchée ?",
        options: [
          "function foo() {}",
          "const foo = () => {}",
          "const foo = function => {}",
        ],
        correct: [1],
      },
      {
        question: "Que fait la méthode `event.preventDefault()` ?",
        options: [
          "Empêche l'action par défaut de l'événement",
          "Arrête la propagation de l'événement",
          "Supprime l'écouteur",
        ],
        correct: [0],
      },
      {
        question:
          "Quel est le scope d'une variable déclarée avec `var` à l'intérieur d'une fonction ?",
        options: ["Bloc (block)", "Fonction (function)", "Global"],
        correct: [1],
      },
      {
        question:
          "Parmi ces techniques, lesquelles sont valables pour rendre une page accessible ?",
        options: [
          "Ajouter des attributs aria",
          "Utiliser uniquement images pour tout le contenu",
          "Utiliser des labels pour les champs de formulaire",
        ],
        correct: [0, 2], // multiple correct
      },
      {
        question: "Quelle est la différence principale entre `==` et `===` ?",
        options: [
          "Aucune, c'est la même chose",
          "`==` compare sans type, `===` compare avec type",
          "`===` convertit toujours les types",
        ],
        correct: [1],
      },
      {
        question:
          "Quelle(s) des énoncées suivantes concernant les Promises est/sont vraies ?",
        options: [
          "Une promise peut être résolue plusieurs fois",
          "Une promise peut être rejetée une seule fois",
          "Une promise est immuable une fois résolue ou rejetée",
        ],
        correct: [1, 2], // multiple correct
      },
      {
        question: "Quel est le résultat de `typeof null` ?",
        options: ["'object'", "'null'", "'undefined'"],
        correct: [0],
      },
    ],
  },
];

const start = document.getElementById("start-quiz");
const title = document.querySelector("h1");
const para = document.querySelector("p");
const container = document.getElementById("container");
let challenger = "";
let levelChoosed = "";
let currentIndex = 0;
let answersSelected = [];
let startTime = null;
let activeQuestions = [];
let countdown;
let userSelections = [];

let timerElement = document.getElementById("timer");
if (!timerElement) {
  timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.style.marginBottom = "8px";
  const header = document.querySelector("h1");
  if (header && header.parentNode)
    header.insertAdjacentElement("afterend", timerElement);
  else container.prepend(timerElement);
}
timerElement.classList.remove("visible", "warning", "expired");

function renderQuestion(index) {
  const q = activeQuestions[index];

  title.textContent = `Question ${index + 1} / ${activeQuestions.length}`;
  para.textContent = q.question;
  container.innerHTML = "";

  let timerLeft = 15;
  timerElement.classList.remove("warning", "expired");
  timerElement.classList.add("visible");
  timerElement.textContent = timerLeft;

  clearInterval(countdown);

  const multiple = q.correct.length > 1;
  q.options.forEach((optText, i) => {
    const input = document.createElement("input");
    const inputId = `q${index}_opt${i}`;
    input.type = multiple ? "checkbox" : "radio";
    input.id = inputId;
    input.name = `q${index}`;
    input.value = i;

    const label = document.createElement("label");
    label.htmlFor = inputId;
    label.innerText = optText;

    container.appendChild(input);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });

  const validateButton = document.createElement("button");
  validateButton.type = "button";
  validateButton.id = "validate-button";
  validateButton.innerText = "Validate";
  container.appendChild(validateButton);

  function captureSelection() {
    const selectedNodes = container.querySelectorAll(
      `input[name="q${index}"]:checked`
    );
    const selectedIndices =
      selectedNodes && selectedNodes.length
        ? Array.from(selectedNodes).map((n) => Number(n.value))
        : [];
    userSelections[index] = selectedIndices;
    return selectedIndices;
  }
 function proceedAfterSelection(markedCorrect) {
    // Called when we actually proceed (either user submitted valid selection or timeout)
    clearInterval(countdown);
    validateButton.disabled = true;
    answersSelected[index] = !!markedCorrect;
    // move to next
    currentIndex++;
    if (currentIndex < activeQuestions.length) {
      renderQuestion(currentIndex);
    } else {
      const elapsed = Date.now() - startTime;
      const correctCount = answersSelected.filter(Boolean).length;
      showResult(correctCount, elapsed);
    }
  }
   function submitAnswer(fromTimeout = false) {
    // If already disabled (submission in progress), ignore
    if (validateButton.disabled) return;

    // capture whatever is currently selected (may be [])
    const selected = captureSelection();

    if (multiple) {
      if (!selected || selected.length === 0) {
        if (!fromTimeout) {
          // user clicked Validate without selection -> show alert, keep timer running
          alert("Choose at least one answer please!");
          return;
        } else {
          // timeout: mark incorrect and proceed
          proceedAfterSelection(false);
          return;
        }
      } else {
        // user selected -> compute correctness then proceed
        const sortedSelected = selected.slice().sort((a,b)=>a-b);
        const correct = q.correct.slice().map(Number).sort((a,b)=>a-b);

        const isCorrect =
          sortedSelected.length === correct.length &&
          sortedSelected.every((v, i) => v === correct[i]);

        proceedAfterSelection(!!isCorrect);
        return;
      }
    } else {
      // single-answer question
      if (!selected || selected.length === 0) {
        if (!fromTimeout) {
          alert("Choose an answer please!");
          return;
        } else {
          proceedAfterSelection(false);
          return;
        }
      } else {
        const selectedIndex = Number(selected[0]);
        const isCorrect = selectedIndex === Number(q.correct[0]);
        proceedAfterSelection(isCorrect);
        return;
      }
    }
  }

  validateButton.addEventListener("click", function () {
    submitAnswer(false);
  });
setTimeout(() => {
    const firstInput = container.querySelector(`input[name="q${index}"]`);
    if (firstInput) firstInput.focus();
  }, 0);
  countdown = setInterval(() => {
    timerLeft--;
    timerElement.textContent = timerLeft;

    if (timerLeft <= 3 && timerLeft > 0) {
      timerElement.classList.add("warning");
    } else {
      timerElement.classList.remove("warning");
    }

    if (timerLeft <= 0) {
      clearInterval(countdown);
      timerElement.classList.remove("warning");
      timerElement.classList.add("expired");
      submitAnswer(true);
    }
  }, 1000);
}

function StartQuiz() {
  // find selected level set
  let found = null;
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (QUESTIONS[i].level === levelChoosed) {
      found = QUESTIONS[i];
      break;
    }
  }
  if (!found) {
    alert("No questions found for this level.");
    return;
  }

  // defensive: ensure at least 10 questions
  if (!found.questions || found.questions.length < 10) {
    alert("This theme must have at least 10 questions.");
    return;
  }

  activeQuestions = found.questions.slice();

  // reset per-quiz state
  start.style.display = "none";
  currentIndex = 0;
  answersSelected = [];
  userSelections = []; // reset saved selections
  startTime = Date.now();

  renderQuestion(currentIndex);
}

function showResult(score, elapsedMs) {
  clearInterval(countdown);
  timerElement.classList.remove("visible", "warning");
  timerElement.classList.add("expired");
  timerElement.textContent = "";
  container.innerHTML = "";

  title.textContent = "Quiz terminé";
  para.textContent = `Score: ${score} / ${activeQuestions.length}`;

  const message = document.createElement("p");
  if (score < Math.ceil(activeQuestions.length / 2))
    message.innerText = "Revise your knowledge";
  else if (score === Math.ceil(activeQuestions.length / 2))
    message.innerText = "Could be better";
  else message.innerText = "VERY GOOD";

  const timeText = document.createElement("p");
  const seconds = (elapsedMs / 1000).toFixed(3);
  timeText.innerText = `You took: ${seconds}s`;

  container.appendChild(message);
  container.appendChild(timeText);

  const restart = document.createElement("button");
  restart.type = "button";
  restart.id = "restart";
  restart.innerText = "Restart the quiz";
  container.appendChild(restart);

  restart.addEventListener("click", restartQuiz);
}

function restartQuiz() {
  clearInterval(countdown);
  currentIndex = 0;
  answersSelected = [];
  startTime = null;

  title.textContent = "JSQuizStarter";
  para.textContent = "Press Start to begin the quiz.";
  container.innerHTML = "";

  start.style.display = "";
}

function choiceLevelName() {
  title.textContent = "JSQuizStarter";

  const storedName = localStorage.getItem("username") || "";

  para.textContent =
    "Please enter a username and choose a level before starting.";

  container.innerHTML = "";
  start.style.display = "none";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Username";
  nameLabel.style.display = "block";
  nameLabel.style.marginBottom = "6px";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.placeholder = "Your name";
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

  const levels = [...new Set(QUESTIONS.map((s) => s.level))];

  const selectLabel = document.createElement("label");
  selectLabel.textContent = "Choose level";
  selectLabel.style.display = "block";
  selectLabel.style.margin = "8px 0 6px 0";

  const select = document.createElement("select");
  select.style.padding = "8px";
  select.style.borderRadius = "6px";
  select.style.border = "1px solid #ddd";
  select.style.display = "block";
  select.style.width = "100%";
  select.style.boxSizing = "border-box";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select level";
  select.appendChild(defaultOption);

  levels.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    select.appendChild(opt);
  });

  container.appendChild(selectLabel);
  container.appendChild(select);

  const controls = document.createElement("div");
  controls.style.marginTop = "14px";
  controls.style.display = "flex";
  controls.style.gap = "8px";

  const btnStart = document.createElement("button");
  btnStart.type = "button";
  btnStart.innerText = "Start";
  btnStart.style.flex = "1";

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.innerText = "Cancel";
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
    const username = usernameInput.value ? usernameInput.value.trim() : "";
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

    challenger = username;
    levelChoosed = selectedLevel;

    localStorage.setItem("username", challenger);
    localStorage.setItem("level", levelChoosed);

    cleanup();
    StartQuiz();
  }

  function cancelHandler() {
    cleanup();
    restartQuiz();
  }

  function keyHandler(e) {
    if (e.key === "Enter") {
      startHandler();
    }
  }

  btnStart.addEventListener("click", startHandler);
  btnCancel.addEventListener("click", cancelHandler);
  usernameInput.addEventListener("keydown", keyHandler);
  select.addEventListener("keydown", keyHandler);

  usernameInput.focus();
}

start.addEventListener("click", choiceLevelName);
