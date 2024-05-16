var flipBoxInner = document.getElementById("flip-box-inner");

function toggleFlip() {
  // Fjerner klikhændelseslytteren
  flipBoxInner.removeEventListener("click", toggleFlip);
  // Flipper boksen
  flipBoxInner.style.transform = "rotateY(180deg)";
}

function revealAnswer(element) {
  // Flipper boksen
  toggleFlip();
  // Viser svaret
  document.getElementById("question-back").style.display = "block";
}
