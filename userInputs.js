const questions = [
  { text: "What is the patient's age?", type: "number" },
  { text: "What is the patient's gender?", type: "string", options: ["Male", "Female", "Other"] }
];

let currentQuestion = -1;
const answers = [];

function showQuestion() {
  const questionEl = document.getElementById("question");
  const input = document.getElementById("answer");
  const select = document.getElementById("answerSelect");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");
  const errorMsg = document.getElementById("error-message");

  errorMsg.textContent = "";

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
    nextBtn.textContent = currentQuestion === questions.length - 1 ? "Finish Inputting" : "Next Question";
    restartBtn.style.display = "none";

  } else {
    questionEl.textContent = "Restart the form below";
    input.style.display = "none";
    select.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    console.log("All answers:", answers);
  }
}

function validateInput(answer, type) {
  if (type === "number") return !isNaN(answer) && answer !== "";
  if (type === "string") return /^[a-zA-Z]+$/.test(answer);
  return false;
}

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
        errorMsg.textContent = `Invalid input. Please enter ${q.type === "number" ? "a number" : "letters only"}.`;
        return;
      }
    }

    answers[currentQuestion] = answer;
    currentQuestion++;
  }

  showQuestion();
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function restartForm() {
  currentQuestion = 0;
  answers.length = 0;
  showQuestion();
}

window.addEventListener("DOMContentLoaded", () => {
  showQuestion();

  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
  document.getElementById("prevBtn").addEventListener("click", prevQuestion);
  document.getElementById("restartBtn").addEventListener("click", restartForm);

  const input = document.getElementById("answer");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") nextQuestion();
  });
});
