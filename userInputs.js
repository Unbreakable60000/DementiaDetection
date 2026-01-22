// Initalising questions array
const questions = [
  { text: "What is the patient's age?", type: "number" },
  { text: "What is the patient's gender?", type: "string", options: ["Male", "Female", "Other"] }
];

// Initalising variables for quiz
let currentQuestion = -1;
const answers = [];

// Function to display the current question
function showQuestion() {
  const questionEl = document.getElementById("question");
  const input = document.getElementById("answer");
  const select = document.getElementById("answerSelect");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const resultsBtn = document.getElementById("resultsBtn");
  const errorMsg = document.getElementById("error-message");

  errorMsg.textContent = "";
  resultsBtn.style.display = "none";

  if (currentQuestion === -1) {
    questionEl.textContent = "Begin the form below";
    input.style.display = "none";
    select.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    nextBtn.textContent = "Start Inputting";
    restartBtn.style.display = "none";
  } else if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionEl.textContent = q.text;

    if (q.options) {
      select.innerHTML = `<option value="">Select...</option>`;
      q.options.forEach(opt => {
        const selected = answers[currentQuestion] === opt ? "selected" : "";
        select.innerHTML += `<option value="${opt}" ${selected}>${opt}</option>`;
      });
      select.style.display = "block";
      input.style.display = "none";
    } else {
      input.value = answers[currentQuestion] || "";
      input.style.display = "block";
      select.style.display = "none";
    }

    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
    nextBtn.style.display = "inline-block";
    nextBtn.textContent =
      currentQuestion === questions.length - 1 ? "Finish Inputting" : "Next Question";
    restartBtn.style.display = "none";
  } else {
    questionEl.textContent = "Restart the form below";
    input.style.display = "none";
    select.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    resultsBtn.style.display = "inline-block";
    console.log("All answers:", answers);
  }
}

// Function to validate user input
function validateInput(answer, type) {
  if (type === "number") return !isNaN(answer) && answer !== "";
  if (type === "string") return /^[a-zA-Z]+$/.test(answer);
  return false;
}

// Function to go to next question
function nextQuestion() {
  const errorMsg = document.getElementById("error-message");
  const input = document.getElementById("answer");
  const select = document.getElementById("answerSelect");

  let answer = "";

  if (currentQuestion === -1) {
    currentQuestion = 0;
  } else if (currentQuestion >= 0 && currentQuestion < questions.length) {
    const q = questions[currentQuestion];

    if (q.options) {
      if (select.selectedIndex === 0) {
        errorMsg.textContent = "Please choose an answer from above.";
        return;
      }
      answer = select.value;
    } else {
      answer = input.value.trim();
      if (!validateInput(answer, q.type)) {
        errorMsg.textContent = `Invalid input. Please enter ${
          q.type === "number" ? "a number" : "letters only"
        }.`;
        return;
      }
    }

    answers[currentQuestion] = answer;
    currentQuestion++;
  }

  showQuestion();
}

// Function to go to previous question
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

// Function to restart the form on index page
function restartForm() {
  currentQuestion = 0;
  answers.length = 0;
  showQuestion();
}

// Function to save answers and go to results page
function goToResults() {
  localStorage.setItem("inputAnswers", JSON.stringify(answers));
  window.location.href = "results.html";
}

// Function to display results table
function displayResults(tableWrapperId = "tableWrapper") {
  const storedAnswers = JSON.parse(localStorage.getItem("inputAnswers"));
  const container = document.getElementById(tableWrapperId);
  if (!container) return;

  const table = document.createElement("table");
  const questionRow = document.createElement("tr");
  const answerRow = document.createElement("tr");

  if (storedAnswers && storedAnswers.length > 0) {
    storedAnswers.forEach((ans, i) => {
      const th = document.createElement("th");
      th.textContent = questions[i] ? questions[i].text : `Q${i+1}`;
      questionRow.appendChild(th);

      const td = document.createElement("td");
      td.textContent = ans || "(No answer)";
      answerRow.appendChild(td);
    });
  } else {
    const th = document.createElement("th");
    th.textContent = "No answers found";
    questionRow.appendChild(th);
  }

  table.appendChild(questionRow);
  table.appendChild(answerRow);
  container.appendChild(table);
}

// Function to restart quiz from results page
function restartQuiz() {
  localStorage.removeItem("inputAnswers");
  window.location.href = "index.html";
}

// Attach event listeners after DOM has loaded
window.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    document.getElementById("nextBtn").addEventListener("click", nextQuestion);
    document.getElementById("prevBtn").addEventListener("click", prevQuestion);
    document.getElementById("restartBtn").addEventListener("click", restartForm);
    document.getElementById("resultsBtn").addEventListener("click", goToResults);
    document.getElementById("answer").addEventListener("keypress", (e) => {
      if (e.key === "Enter") nextQuestion();
    });
    showQuestion();
  }

  const restartResultsBtn = document.getElementById("restartBtnResults");
  if (restartResultsBtn) {
    restartResultsBtn.addEventListener("click", restartQuiz);
  }

  if (document.getElementById("tableWrapper")) {
    displayResults();
  }
});
