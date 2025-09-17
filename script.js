const QUESTIONS = [
  {
    question: "Quelle est la capitale de la France ?",
    options: ["Lyon", "Paris", "Marseille"],
    correct: 1,
  },
  {
    question: "En JavaScript, lequel est un type primitif ?",
    options: ["Object", "Array", "Number"],
    correct: 2,
  },
  {
    question: "HTML signifie :",
    options: ["HyperText Markup Language", "Home Tool Markup Language"],
    correct: 0,
  },
  {
    question: "Le CSS sert à :",
    options: [
      "Structurer le contenu",
      "Styliser le contenu",
      "Programmer la logique",
    ],
    correct: 1,
  },
  {
    question: "Quelle balise HTML correspond à un paragraphe ?",
    options: ["<p>", "<div>", "<span>"],
    correct: 0,
  },
  {
    question: "Quelle méthode permet d'ajouter un écouteur d'événement en JS ?",
    options: ["addEventListener", "attachEvent"],
    correct: 0,
  },
  {
    question: "Quel opérateur compare sans convertir les types ?",
    options: ["==", "==="],
    correct: 1,
  },
  {
    question: "Quelle propriété retourne la longueur d'une chaîne en JS ?",
    options: ["len()", "length", "size()"],
    correct: 1,
  },
  {
    question: "Quel mot-clé déclare une constante en JavaScript ?",
    options: ["let", "var", "const"],
    correct: 2,
  },
  {
    question:
      "Comment centrer un block (largeur fixe) horizontalement en CSS ?",
    options: ["margin: 0 auto;", "text-align: center;"],
    correct: 0,
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

function renderQuestion(index) {
  title.textContent = `Question ${index + 1} / ${QUESTIONS.length}`;
  para.textContent = QUESTIONS[index].question;
  container.innerHTML = "";

  QUESTIONS[index].options.forEach((optText, i) => {
    const input = document.createElement("input");
    const inputId = `q${index}_opt${i}`;
    input.type = "radio";
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
      const checked = container.querySelector(
        `input[name="q${index}"]:checked`
      );
      if (!checked) {
        alert("Choose an answer please!");
        return;
      }
      const selectedIndex = Number(checked.value);
      answersSelected[index] = selectedIndex === QUESTIONS[index].correct;

      currentIndex++;
      if (currentIndex < QUESTIONS.length) {
        renderQuestion(currentIndex);
      } else {
        const elapsed = Date.now() - startTime;
        const correctCount = answersSelected.filter(Boolean).length;
        showResult(correctCount, elapsed);
      }
    },
    { once: true }
  );
}

function StartQuiz() {
  start.style.display = "none";
  currentIndex = 0;
  answersSelected = [];
  startTime = Date.now();
  renderQuestion(currentIndex);
}

function showResult(score, elapsedMs) {
  container.innerHTML = "";

  title.textContent = "Quiz terminé";
  para.textContent = `Score: ${score} / ${QUESTIONS.length}`;

  const message = document.createElement("p");
  if (score < 5) message.innerText = "Revise your knowledge";
  else if (score === 5) message.innerText = "Could be better";
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
  para.textContent = "Please choose name and a level before starting";
  container.innerHTML = "";
  start.style.display = "none";

  const usernameInput = document.createElement("input");
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Username";
  usernameInput.type = "text";
  usernameInput.name = "username";
  container.appendChild(nameLabel);
  container.appendChild(usernameInput);

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
    const username = usernameInput.value ? usernameInput.value.trim() : "";

    if (!username) {
      alert("Please enter your name before starting.");
      usernameInput.focus();
      return;
    }

    if (!checkedLevelInput) {
      alert("Choose a level please!");
      return;
    }

    challenger = username;
    levelChoosed = checkedLevelInput.value;

    localStorage.setItem("username", challenger);
    localStorage.setItem("level", levelChoosed);

    StartQuiz();
  });
}


start.addEventListener("click", choiceLevelName);
