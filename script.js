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

function renderQuestion(index) {
  const q = activeQuestions[index];

  title.textContent = `Question ${index + 1} / ${activeQuestions.length}`;
  para.textContent = q.question;
  container.innerHTML = "";

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

  validateButton.addEventListener(
    "click",
    function () {
      if (multiple) {
        const checkedNodes = container.querySelectorAll(
          `input[name="q${index}"]:checked`
        );
        if (!checkedNodes || checkedNodes.length === 0) {
          alert("Choose at least one answer please!");
          return;
        }
        // Array.from(x) converts a list x into real array
        const selected = Array.from(checkedNodes)
          .map((n) => Number(n.value))
          .sort((a, b) => a - b);
        const correct = q.correct
          .slice()
          .map(Number)
          .sort((a, b) => a - b);

        const isCorrect =
          selected.length === correct.length &&
          // every() returns true if every element from selected
          //  passes the function inside of it
          selected.every((v, i) => v === correct[i]);
        // !!x turns x strictly to a boolean
        answersSelected[index] = !!isCorrect;
      } else {
        const checked = container.querySelector(
          `input[name="q${index}"]:checked`
        );
        if (!checked) {
          alert("Choose an answer please!");
          return;
        }
        const selectedIndex = Number(checked.value);
        answersSelected[index] = selectedIndex === Number(q.correct[0]);
      }

      currentIndex++;
      if (currentIndex < activeQuestions.length) {
        renderQuestion(currentIndex);
      } else {
        const elapsed = Date.now() - startTime;
        const correctCount = answersSelected.filter(Boolean).length;
        showResult(correctCount, elapsed);
      }
    },
    // runs the event listener only once
    { once: true }
  );
}

function StartQuiz() {
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

  activeQuestions = found.questions.slice();

  start.style.display = "none";
  currentIndex = 0;
  answersSelected = [];
  startTime = Date.now();

  renderQuestion(currentIndex);
}

function showResult(score, elapsedMs) {
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

  const storedName = localStorage.getItem("username");
  const askingForName = !storedName;

  para.textContent = askingForName
    ? "Please choose name and a level before starting"
    : `Welcome back, ${storedName}. Please choose a level to start.`;

  container.innerHTML = "";
  start.style.display = "none";

  let usernameInput = null;
  if (askingForName) {
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Username";
    usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    container.appendChild(nameLabel);
    container.appendChild(usernameInput);
  } else {
    const note = document.createElement("div");
    note.textContent = `Using saved name: ${storedName}`;
    note.style.marginBottom = "8px";
    container.appendChild(note);
  }

  const levels = ["easy", "medium", "hard"];
  levels.forEach((level) => {
    const choiceInput = document.createElement("input");
    const choiceLabel = document.createElement("label");

    choiceInput.id = `level-${level}`;
    choiceInput.type = "radio";
    choiceInput.name = "level";
    choiceInput.value = level;

    choiceLabel.htmlFor = choiceInput.id;
    choiceLabel.textContent = level;

    container.appendChild(choiceInput);
    container.appendChild(choiceLabel);
  });

  const validateButton = document.createElement("button");
  validateButton.type = "button";
  validateButton.id = "validate-button";
  validateButton.innerText = "Validate";
  container.appendChild(validateButton);

  validateButton.addEventListener("click", function () {
    const checkedLevelInput = container.querySelector(
      'input[name="level"]:checked'
    );

    const username = askingForName
      ? usernameInput.value
        ? usernameInput.value.trim()
        : ""
      : storedName;

    if (askingForName && !username) {
      alert("Please enter your name before starting.");
      if (usernameInput) usernameInput.focus();
      return;
    }

    if (!checkedLevelInput) {
      alert("Choose a level please!");
      return;
    }

    challenger = username;
    levelChoosed = checkedLevelInput.value;

    if (askingForName) {
      localStorage.setItem("username", challenger);
    }

    localStorage.setItem("level", levelChoosed);

    StartQuiz();
  });
}

start.addEventListener("click", choiceLevelName);
