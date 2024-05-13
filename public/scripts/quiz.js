var textElement = document.getElementById("changeable-text2");
var buttonElement = document.getElementById("change-button2");

buttonElement.addEventListener("click", function() {

  textElement.innerHTML = "svar";
});

var changeableText1 = document.getElementById("changeable-text1");
var changeButton1 = document.getElementById("change-button1");
var changeableText2 = document.getElementById("changeable-text2");
var changeButton2 = document.getElementById("change-button2");
var changeableText3 = document.getElementById("changeable-text3");
var changeButton3 = document.getElementById("change-button3");
var changeableText4 = document.getElementById("changeable-text4");
var changeButton4 = document.getElementById("change-button4");
var changeableText5 = document.getElementById("changeable-text5");
var changeButton5 = document.getElementById("change-button5");


changeButton1.addEventListener("click", function() {

  changeableText1.textContent = "Coal er mest farligt";
  
  changeButton1.textContent = "Skjul svar";
});

changeButton2.addEventListener("click", function() {

  changeableText2.textContent = "Kul";
  
  changeButton2.textContent = "Skjul svar";
});

changeButton3.addEventListener("click", function() {
 
  changeableText3.textContent = "Solar";
  
  changeButton3.textContent = "Skjul svar";
});

changeButton4.addEventListener("click", function() {
 
  changeableText4.textContent = "Nuclear";
  
  changeButton4.textContent = "Skjul svar";
});

changeButton5.addEventListener("click", function() {
  
  changeableText5.textContent = "Ja";
  
  changeButton5.textContent = "Skjul svar";
});
