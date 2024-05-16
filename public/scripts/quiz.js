function toggleFlip() {
  var flipBoxInner = document.getElementById("flip-box-inner");
  flipBoxInner.style.transform = "rotateY(180deg)";
}

function revealAnswer(element) {
  var correctAnswer = "Coal"; // Update with the correct answer
  var userAnswer = element.textContent;
  var answerFeedback = document.getElementById("answer-feedback");

  // Check if the answer is correct
  if (userAnswer === correctAnswer) {
    answerFeedback.textContent = "Korrekt svar!";
    element.classList.add("correct-answer");
  } else {
    answerFeedback.textContent = "Forkert svar. Det korrekte svar er: " + correctAnswer;
    element.classList.add("wrong-answer");
  }

  // Display the answer feedback
  document.getElementById("question-back").style.display = "block";

  // Flip the box after a short delay
  setTimeout(toggleFlip, 1000); // Adjust delay as needed
}
var currentQuestionIndex = 0;

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < 2) { // Adjust the condition based on the number of questions
        updateQuestion();
        toggleFlip();
    } else {
        alert("Du har nået slutningen af quizzen!");
    }
}

function updateQuestion() {
    var questionFront = document.getElementById("question-front");
    var questionBack = document.getElementById("question-back");

    // Hide current question
    questionFront.style.display = "none";
    questionBack.style.display = "none";

    // Display new question
    var questionFrontNew = document.getElementById("qestion-front-" + currentQuestionIndex);
    var questionBackNew = document.getElementById("question-back-" + currentQuestionIndex);
    questionFrontNew.style.display = "block";
    questionBackNew.style.display = "block";
}
