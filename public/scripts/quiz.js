const questions = [
  {
    question: "Which power plant is the most dangerous energy source?",
    answers: ["Nuclear", "Coal", "Solar"],
    feedback: "Coal power plants are the most dangerous to be around! It even has a deathrate, that is over 800 times higher than Nuclear power plants!",
    correctAnswer: "Coal"
  },
  {
    question: "Which power plant emits the most CO2?",
    answers: ["Coal", "Natural Gas", "Oil"],
    feedback: "Coal is more carbon-intensive than burning natural gas or petroleum for electric power production!",
    correctAnswer: "Coal"
  },
  {
    question: "Which of these power plants kills the most?",
    answers: ["Oil", "Gas", "Nuclear"],
    feedback: "Like coal, oil has a deathrate that is over 600 times higher than Nuclear!",
    correctAnswer: "Oil"
  },
  {
    question: "Which energy source has the highest efficiency in energy production?",
    answers: ["Coal", "Nuclear", "Solar"],
    feedback: "Even tho nuclear is the one with the lowest amount of CO2 emission, and has the lowest deathrate, nuclear actually produce much more energy, than all of the others!",
    correctAnswer: "Nuclear"
  }
];

let index = 0;
let correctAnswers = 0;

const wrongAnswer = function () {
  d3.select(this).style("background-color", "#ffcccc");
  document.getElementById("quiz-response").textContent = "Wrong!";
  document.getElementById("quiz-feedback").textContent = questions[index].feedback;
  setTimeout(d => {
    document.getElementById("flip-card-inner").style.transform = "rotateY(180deg)";
  }, 500)
  index++;
}

const correctAnswer = function () {
  d3.select(this).style("background-color", "#ccffcc")
  document.getElementById("quiz-response").textContent = "Correct!";
  document.getElementById("quiz-feedback").textContent = questions[index].feedback;
  setTimeout(d => {
    document.getElementById("flip-card-inner").style.transform = "rotateY(180deg)";
  }, 500)
  index++;
  correctAnswers++;
}

const startQuiz = function () {
  d3.select(this).remove();
  d3.selectAll("#quiz-description").text("")
  document.getElementById("quiz-header").textContent = questions[index].question;
  d3.select("#flip-card-front")
    .append("button")
    .attr("id", "answerOne")
    .text(questions[index].answers[0])
    .on("click", wrongAnswer);
  d3.select("#flip-card-front")
    .append("button")
    .attr("id", "answerTwo")
    .text(questions[index].answers[1])
    .on("click", correctAnswer);
  d3.select("#flip-card-front")
    .append("button")
    .attr("id", "answerThree")
    .text(questions[index].answers[2])
    .on("click", wrongAnswer);
}

const tryAgain = function () {
  d3.selectAll("#restart-quiz").remove();
  document.getElementById("quiz-header").textContent = "Test your knowlege of power plants!";
  d3.select("#flip-card-back")
    .append("button")
    .attr("id", "next-question")
    .text("Next Question")
    .on("click", nextQuestion);
  index = 0;
  correctAnswers = 0;
  startQuiz();
}

const nextQuestion = function () {
  if (index < questions.length) {
    document.getElementById("flip-card-inner").style.transform = "rotateY(0deg)";
    d3.selectAll("#answerOne, #answerTwo, #answerThree").style("background-color", "#e7e7e7");
    d3.select("#quiz-header").text(questions[index].question);
    if (questions[index].answers[0] === questions[index].correctAnswer) {
      d3.select("#answerOne").text(questions[index].answers[0]).on("click", correctAnswer);
    } else {
      d3.select("#answerOne").text(questions[index].answers[0]).on("click", wrongAnswer);
    }
    if (questions[index].answers[1] === questions[index].correctAnswer) {
      d3.select("#answerTwo").text(questions[index].answers[1]).on("click", correctAnswer);
    } else {
      d3.select("#answerTwo").text(questions[index].answers[1]).on("click", wrongAnswer);
    }
    if (questions[index].answers[2] === questions[index].correctAnswer) {
      d3.select("#answerThree").text(questions[index].answers[2]).on("click", correctAnswer);
    } else {
      d3.select("#answerThree").text(questions[index].answers[2]).on("click", wrongAnswer);
    }
  } else {
    document.getElementById("flip-card-inner").style.transform = "rotateY(0deg)";
    document.getElementById("quiz-header").textContent = "That's it!";
    document.getElementById("quiz-description").textContent = "You got " + correctAnswers + "/4 correct!";
    d3.select("#flip-card-inner").selectAll("button").remove();
    d3.select("#flip-card-front").append("button").attr("id", "restart-quiz").text("Try again").on("click", tryAgain);
  }

}

d3.select("#next-question").on("click", nextQuestion);

d3.select("#start-quiz").on("click", startQuiz);