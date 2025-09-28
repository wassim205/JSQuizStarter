// Quiz controller - manages quiz flow, timing, and scoring
import * as UI from "./uiController.js"
import * as Storage from "./storageService.js"
import { safeNumber } from "./utils.js"

// Quiz state variables
let currentQuestions = []
let currentQuestionIndex = 0
let userAnswers = []
let userSelections = []
let quizStartTime = null
let questionTimer = null

/* Starts a new quiz with the provided questions */
export function startQuiz(questions = [], metadata = {}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    alert("No questions available to start the quiz.")
    return
  }

  // Initialize quiz state
  currentQuestions = questions.slice()
  currentQuestionIndex = 0
  userAnswers = []
  userSelections = []
  quizStartTime = Date.now()

  // Hide start button
  const startButton = document.getElementById("start-quiz")
  if (startButton) {
    startButton.style.display = "none"
  }

  // Start with first question
  displayQuestion(currentQuestionIndex)
}

/* Displays a question at the specified index */
function displayQuestion(questionIndex) {
  const question = currentQuestions[questionIndex]
  if (!question) {
    console.error("Question not found at index:", questionIndex)
    return
  }

  // Render question
  const { validateButton, getSelectedIndices, focusFirstInput } = UI.renderQuestionUI({
    q: question,
    index: questionIndex,
    total: currentQuestions.length,
  })

  // Set up question timer
  const timeLimit = safeNumber(question.time, 15) || 15
  startQuestionTimer(timeLimit, validateButton, getSelectedIndices, question)

  // Set up validation button
  validateButton.addEventListener("click", () => {
    handleAnswerSubmission(false, getSelectedIndices, question, questionIndex)
  })

  // Focus on first input for better UX
  if (typeof focusFirstInput === "function") {
    focusFirstInput()
  }
}

/* Starts the countdown timer for a question */
function startQuestionTimer(timeLimit, validateButton, getSelectedIndices, question) {
  let timeRemaining = timeLimit

  // Update timer display
  UI.updateTimerText(timeRemaining)
  UI.setTimerState("")
  UI.setTimerVisible(true)

  // Clear any existing timer
  clearInterval(questionTimer)

  // Start countdown
  questionTimer = setInterval(() => {
    timeRemaining--
    UI.updateTimerText(timeRemaining)

    // Show warning when time is low
    if (timeRemaining <= 3 && timeRemaining > 0) {
      UI.setTimerState("warning")
    } else {
      UI.setTimerState("")
    }

    // Handle timeout
    if (timeRemaining <= 0) {
      clearInterval(questionTimer)
      UI.setTimerState("expired")
      handleAnswerSubmission(true, getSelectedIndices, question, currentQuestionIndex)
    }
  }, 1000)
}

/* Handles answer submission (by user click or timeout) */
function handleAnswerSubmission(isTimeout, getSelectedIndices, question, questionIndex) {
  const validateButton = document.getElementById("validate-button")

  // Prevent multiple submissions
  if (validateButton && validateButton.disabled) {
    return
  }

  // Get user's selected answers
  const selectedIndices = getSelectedIndices()
  const correctIndices = (question.correct || []).map(Number)
  const isMultipleChoice = correctIndices.length > 1

  // Store user selection
  userSelections[questionIndex] = selectedIndices

  // Validate selection (unless timeout with no selection)
  if (!selectedIndices || selectedIndices.length === 0) {
    if (!isTimeout) {
      const message = isMultipleChoice ? "Please select at least one answer!" : "Please select an answer!"
      alert(message)
      return
    }
  }

  // Stop timer and disable inputs
  clearInterval(questionTimer)
  disableQuestionInputs(questionIndex, validateButton)

  // Check if answer is correct
  const isCorrect = checkAnswerCorrectness(selectedIndices, correctIndices, isMultipleChoice)

  // Store answer result
  userAnswers[questionIndex] = isCorrect
  question._wasCorrect = isCorrect

  // Show visual feedback then proceed
  UI.visualFeedback(questionIndex, selectedIndices, correctIndices, () => {
    proceedToNextQuestion()
  })
}

/* Checks if the selected answers are correct */
function checkAnswerCorrectness(selected, correct, isMultiple) {
  if (!selected || selected.length === 0) {
    return false
  }

  if (isMultiple) {
    // For multiple choice, all selections must match exactly
    const sortedSelected = selected.map(Number).sort((a, b) => a - b)
    const sortedCorrect = correct.sort((a, b) => a - b)

    return (
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((value, index) => value === sortedCorrect[index])
    )
  } else {
    // For single choice, check if the first selection matches
    return Number(selected[0]) === correct[0]
  }
}

/* Disables all inputs for the current question */
function disableQuestionInputs(questionIndex, validateButton) {
  // Disable validate button
  if (validateButton) {
    validateButton.disabled = true
  }

  // Disable all question inputs
  const container = document.getElementById("container")
  if (container) {
    const inputs = container.querySelectorAll(`input[name="q${questionIndex}"]`)
    inputs.forEach((input) => {
      input.disabled = true
    })
  }
}

/* Proceeds to the next question or finishes the quiz */
function proceedToNextQuestion() {
  currentQuestionIndex++

  if (currentQuestionIndex < currentQuestions.length) {
    displayQuestion(currentQuestionIndex)
  } else {
    finishQuiz()
  }
}

/* Finishes the quiz and shows results */
function finishQuiz() {
  // Stop any running timer
  clearInterval(questionTimer)

  // Calculate results
  const quizEndTime = Date.now()
  const elapsedTime = quizEndTime - (quizStartTime || quizEndTime)
  const correctAnswers = userAnswers.filter(Boolean).length

  // Create attempt record
  const quizAttempt = {
    username: Storage.getUsername() || "Anonymous",
    date: new Date().toISOString(),
    score: `${correctAnswers}/${currentQuestions.length}`,
    level: Storage.getLevel() || "Unknown",
    theme: Storage.getTheme() || "Unknown",
    answers: userSelections,
    elapsedMs: elapsedTime,
  }

  // Save attempt and clear session data
  try {
    Storage.saveAttempt(quizAttempt)
    Storage.clearSessionData()
  } catch (error) {
    console.error("Could not save quiz attempt:", error)
  }

  UI.showResultUI({
    score: correctAnswers,
    total: currentQuestions.length,
    userSelections,
    activeQuestions: currentQuestions,
    elapsedMs: elapsedTime,
    onRestart: restartQuiz,
  })
}

/* Restarts the quiz application to initial state */
export function restartQuiz() {
  // Clear quiz state
  clearInterval(questionTimer)
  currentQuestionIndex = 0
  userAnswers = []
  userSelections = []
  quizStartTime = null
  currentQuestions = []

  const startButton = document.getElementById("start-quiz")
  if (startButton) {
    startButton.style.display = ""
  }

  const title = document.querySelector("h1")
  const description = document.querySelector("p")

  if (title) {
    title.textContent = "JSQuizStarter"
  }

  if (description) {
    description.textContent = "Challenge yourself with interactive quizzes that make you stronger!"
  }

  const container = document.getElementById("container")
  if (container) {
    container.innerHTML = ""
  }

  UI.setTimerVisible(false)
}