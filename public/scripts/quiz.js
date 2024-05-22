var currentQuestionIndex = 0;
var isFlipped = false;

var questions = [
  { correctAnswer: "Coal", feedback: "Coal is the most dangerous" },
  { correctAnswer: "Coal", feedback: "Coal emits the most Co2" },
  { correctAnswer: "Oil", feedback: "Oil has the highest deathrate of the 3" },
  { correctAnswer: "Nuclear", feedback: "Nuclear power plants" },
  { correctAnswer: "Yes", feedback: "Nuclear power plants are the greenest" }
];

function toggleFlip() {
  var flipBoxInner = document.getElementById("flip-box-inner");
  if (isFlipped) {
    flipBoxInner.style.transform = "rotateY(0deg)";
    isFlipped = false;
  } else {
    flipBoxInner.style.transform = "rotateY(180deg)";
    isFlipped = true;
  }
}

function revealAnswer(element) {
  var userAnswer = element.textContent;
  var answerFeedback = document.querySelector("#question-back-" + currentQuestionIndex + " #answer-feedback");

  // Check if the answer is correct
  if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
    answerFeedback.textContent = "Correct Answer!";
    element.classList.add("correct-answer");
  } else {
    answerFeedback.textContent = "Wrong Answer. The correct answer is: " + questions[currentQuestionIndex].correctAnswer;
    element.classList.add("wrong-answer");
  }

  // Display the answer feedback
  document.getElementById("question-back-" + currentQuestionIndex).style.display = "block";

  // Flip the box after a short delay
  setTimeout(toggleFlip, 1000); // Adjust delay as needed
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) { // Check against the number of questions
    setTimeout(() => {
      updateQuestion();
      toggleFlip();
    }, 500); // Adjust delay to ensure the flip animation completes
  } else {
    alert("Du har nået slutningen af quizzen!");
  }
}

function updateQuestion() {
  var questionFrontOld = document.getElementById("question-front-" + (currentQuestionIndex - 1));
  var questionBackOld = document.getElementById("question-back-" + (currentQuestionIndex - 1));

  // Hide current question
  if (questionFrontOld) questionFrontOld.style.display = "none";
  if (questionBackOld) questionBackOld.style.display = "none";

  // Display new question
  var questionFrontNew = document.getElementById("question-front-" + currentQuestionIndex);
  var questionBackNew = document.getElementById("question-back-" + currentQuestionIndex);
  if (questionFrontNew) questionFrontNew.style.display = "block";
  if (questionBackNew) questionBackNew.style.display = "block";
}
