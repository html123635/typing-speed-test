const passages = {
  easy: [
    "Learning to type faster takes time and daily practice. Stay calm and focus on typing every word correctly.",
    "Technology helps people learn new skills and solve problems. Practice makes difficult tasks easier over time."
  ],
  medium: [
    "Programming teaches us how to solve problems logically. A good developer writes clean code, tests ideas, and learns from mistakes.",
    "Success does not happen overnight. Small improvements, consistent practice, and patience can help you achieve your goals."
  ],
  hard: [
    "Modern applications combine creativity, algorithms, and thoughtful design. Developers must consider performance, accessibility, security, and reliability.",
    "Complex problems become manageable when divided into smaller tasks. Analyze the requirements, test your assumptions, and improve the solution."
  ]
};

const passageEl = document.getElementById("passage");
const input = document.getElementById("input");
const duration = document.getElementById("duration");
const difficulty = document.getElementById("difficulty");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");
const progressEl = document.getElementById("progress");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

let target = "";
let started = false;
let finished = false;
let startTime = 0;
let timerId = null;
let timeLeft = Number(duration.value);
let passageIndex = 0;

function choosePassage() {
  const list = passages[difficulty.value];
  target = list[passageIndex % list.length];
  passageIndex++;
}

function renderPassage() {
  const typed = input.value;
  passageEl.innerHTML = "";

  [...target].forEach((character, index) => {
    const span = document.createElement("span");
    span.textContent = character;

    if (index < typed.length) {
      span.classList.add(
        typed[index] === character ? "correct" : "incorrect"
      );
    } else if (index === typed.length) {
      span.classList.add("current");
    }

    passageEl.appendChild(span);
  });
}

function getStats() {
  const typed = input.value;
  let correct = 0;
  let errors = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) {
      correct++;
    } else {
      errors++;
    }
  }

  const elapsed = started
    ? Math.max((Date.now() - startTime) / 60000, 1 / 60000)
    : 0;

  const wpm = elapsed > 0
    ? Math.round((correct / 5) / elapsed)
    : 0;

  const accuracy = typed.length
    ? Math.round((correct / typed.length) * 100)
    : 100;

  return { wpm, accuracy, errors };
}

function updateStats() {
  const stats = getStats();
  wpmEl.textContent = stats.wpm;
  accuracyEl.textContent = stats.accuracy + "%";
  errorsEl.textContent = stats.errors;

  const progress = target.length
    ? Math.min((input.value.length / target.length) * 100, 100)
    : 0;

  progressEl.style.width = progress + "%";
}

function startTimer() {
  started = true;
  startTime = Date.now();
  statusEl.textContent = "Test in progress...";
  timerId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeLeft = Math.max(Number(duration.value) - elapsed, 0);
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      finishTest();
    }
  }, 200);
}

function finishTest() {
  if (finished) return;

  finished = true;
  clearInterval(timerId);
  input.disabled = true;
  statusEl.textContent = "Test completed!";
  timeEl.textContent = timeLeft;

  const stats = getStats();
  document.getElementById("finalWpm").textContent = stats.wpm;
  document.getElementById("finalAccuracy").textContent =
    stats.accuracy + "%";
  document.getElementById("finalErrors").textContent = stats.errors;

  document.getElementById("message").textContent =
    stats.wpm >= 50
      ? "Excellent work! Keep building your accuracy."
      : stats.wpm >= 30
      ? "Good job! Keep practicing to improve your speed."
      : "Great start! Consistent practice will help you improve.";

  resultEl.classList.remove("hidden");
}

function resetTest(newPassage = false) {
  clearInterval(timerId);
  started = false;
  finished = false;
  timeLeft = Number(duration.value);

  if (newPassage || !target) {
    choosePassage();
  }

  input.value = "";
  input.disabled = false;
  timeEl.textContent = timeLeft;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  errorsEl.textContent = "0";
  progressEl.style.width = "0%";
  statusEl.textContent = "Ready when you are";
  resultEl.classList.add("hidden");

  renderPassage();
  input.focus();
}

input.addEventListener("input", () => {
  if (finished) return;

  if (!started && input.value.length > 0) {
    startTimer();
  }

  renderPassage();
  updateStats();

  if (input.value.length >= target.length) {
    finishTest();
  }
});

document.getElementById("restart").addEventListener("click", () => {
  resetTest(true);
});

document.getElementById("again").addEventListener("click", () => {
  resetTest(true);
});

duration.addEventListener("change", () => resetTest());
difficulty.addEventListener("change", () => resetTest(true));

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

input.addEventListener("keydown", event => {
  if (event.key === "Tab") {
    event.preventDefault();
    if (event.shiftKey) return;
    resetTest(true);
  }
});

resetTest();