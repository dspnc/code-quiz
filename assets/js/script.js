var questionBoxEl = document.getElementById('question-box');
var timerEl = document.querySelector("#timer");
var scoreEl = document.querySelector("#score");
var questionEl = document.querySelector("#question")
var answerEl = document.querySelector("#answers")
var startBtnEl = document.getElementById("start-btn")
var correctEl = document.getElementById("correct")
var wrongEl = document.getElementById("wrong")
var homeContainerEl = document.querySelector(".home-container")
var questionContainerEl = document.querySelector(".question-container")
var completeContainerEl = document.querySelector(".complete-container")
var resultEl = document.querySelector("#result")
var initialsFormEl = document.getElementById("enter-initials")
var scoresListEl = document.querySelector("#high-scores-list")
var highScoreEl = document.querySelector(".high-scores-container")
var highScoreLink = document.getElementById("high-scores")
var clearBtn = document.getElementById("clear-scores")
var backBtn = document.getElementById("go-back")

var index = 0
var score = 0

//array to store high scores from storage
var highScoresList = [];

//array of question/answer objects
var quizQuestions = [
    {   
        q: "Commonly used data types do NOT include?",
        a: "A: alerts",
        options: [{option: "A: alerts"}, {option: "B: booleans"}, {option: "C: numbers"}, {option: "D: strings"}]
    }, 
    {
        q: "The condition in an if/else statement is enclosed within _____",
        a: "C: parentheses",
        options: [{option: "A: brackets"}, {option: "B: commas"}, {option: "C: parentheses"}, {option: "D: curly brackets"}]
    },
    {
        q: "Arrays in Javascript can be used to store ____",
        a: "D: All of the above",
        options: [{option: "A: numbers"}, {option: "B: strings"}, {option: "C: objects"}, {option: "D: All of the above"}]
    },
    {
        q: "String values must be enclosed within ____ when being assigned in variables",
        a: "B: quotes",
        options: [{option: "A: parentheses"}, {option: "B: quotes"}, {option: "C: curly brackets"}, {option: "D: None of the above"}]
    },
    {
        q: "A very useful tool used during development and debugging for printing content to the debugger is: ",
        a: "A: console.log()",
        options: [{option: "A: console.log()"}, {option: "B: terminal/bash"}, {option: "C: Javascript"}, {option: "for loops"}]
    }
]

//implement a timer
var secondsLeft = 50;

//Start at 50 seconds and display countdown, showResult when it is complete
function setTime() {
  var timerInterval = setInterval(function() {
    timerEl.textContent = secondsLeft;
    scoreEl.textContent = score;
    secondsLeft--;
    if(secondsLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}



function startGame() {
    homeContainerEl.classList.add("hidden")
    homeContainerEl.classList.remove("visible")
    questionContainerEl.classList.add("visible")
    questionContainerEl.classList.remove("hidden")
    setTime()
    newQuestion()
}

function newQuestion() {
    removeAnswers()
    showQuestion(quizQuestions[index])
}

function removeAnswers(){
    for (var i= answerEl.children.length; i>0; i--) {
        answerEl.removeChild(answerEl.firstChild)
    }
}


function showQuestion(index) {
    questionEl.textContent = index.q;
    for (var i=0; i<index.options.length; i++) {
        var answerButton = document.createElement("button");
        answerButton.innerHTML = index.options[i].option;
        answerButton.addEventListener("click", checkAnswer);
        answerEl.appendChild(answerButton);
    };
};

function checkAnswer(event) {
    var optionsChoice = event.target
    if (quizQuestions[index].a === optionsChoice.textContent){
        correctAnswer()
        score = score + 10
    }
    else {
        wrongAnswer();
        score = score - 5;
        secondsLeft = secondsLeft - 5;
    }

    //add one to index and compare to quiz length to determine whether quiz should continue or complete
    index++;
    if (quizQuestions.length >= index+1){
        newQuestion();
    }
    else {
        secondsLeft = 0;
    }
}

function correctAnswer(){
    if (correctEl.className == "hidden") {
        correctEl.classList.remove("hidden")
        correctEl.classList.add("visible")
        wrongEl.classList.remove("visible")
        wrongEl.classList.add("hidden")
    }
}

function wrongAnswer(){
    if (wrongEl.className == "hidden") {
        wrongEl.classList.remove("hidden")
        wrongEl.classList.add("visible")
        correctEl.classList.remove("visible")
        correctEl.classList.add("hidden")
    }
}

function showResult() {
    questionContainerEl.classList.add("hidden")
    completeContainerEl.classList.remove("hidden")
    completeContainerEl.classList.add("visible")
    questionEl.textContent = ""
    answerEl.textContent = ""
    if (wrongEl.className == "visible") {
        wrongEl.classList.remove("visible")
        wrongEl.classList.add("hidden")
    }
    if (correctEl.className == "visible") {
        correctEl.classList.remove("visible")
        correctEl.classList.add("hidden")
    }

    var finalScore = document.createElement("p")
    finalScore.textContent = "Your score is " + score
    completeContainerEl.appendChild(finalScore)

}

function addNewScore(event) {
    event.preventDefault()
    var initials = document.querySelector("#initials").value;
    if (initials === '') {
        alert("Enter your initials");
    }

    initialsFormEl.reset();

    var newScore = {
        initials: initials,
        score: score
    }

    highScoresList.push(newScore)

    while (scoresListEl.firstChild) {
        scoresListEl.removeChild(scoresListEl.firstChild)
    }



    for (var i=0; i<highScoresList.length; i++) {
        var scoreEl = document.createElement("li");
        scoreEl.innerHTML = highScoresList[i].initials + "   ---   " + highScoresList[i].score;
        scoresListEl.appendChild(scoreEl);
    }

    saveScore();


    displayHighScores();

}


function saveScore() {
    localStorage.setItem("High-Scores", JSON.stringify(highScoresList))
}

function displayHighScores() {
    homeContainerEl.classList.remove("visible")
    homeContainerEl.classList.add("hidden")
    highScoreEl.classList.remove("hidden")
    highScoreEl.classList.add("visible")
    completeContainerEl.classList.remove("visible")
    completeContainerEl.classList.add("hidden")
    questionContainerEl.classList.remove("visible")
    questionContainerEl.classList.add("hidden")
    correctEl.classList.remove("visible")
    correctEl.classList.add("hidden")
    wrongEl.classList.remove("visible")
    wrongEl.classList.add("hidden")
}

function clearHighScores() {
    highScoresList = []

    while (scoresListEl.firstChild) {
        scoresListEl.removeChild(scoresListEl.firstChild)
    }
    localStorage.clear(highScoresList)

   
}

function loadScores() {
    var highScores = localStorage.getItem("High-Scores");
    if(!highScores){
        return false;
    }
    highScores = JSON.parse(highScores)

    for (var i=0; i<highScores.length; i++) {
        var scoreEl = document.createElement("li");
        scoreEl.innerHTML = highScores[i].initials + "   ---   " + highScores[i].score;
        scoresListEl.appendChild(scoreEl);
        highScoresList.push(highScores[i]);
    }
}

function goBack(){
    highScoreEl.classList.remove("visible")
    highScoreEl.classList.add("hidden")
    homeContainerEl.classList.remove("hidden")
    homeContainerEl.classList.add("visible")
    index = 0;
    score = 0;
    secondsLeft = 50;

}

loadScores()


startBtnEl.addEventListener("click", startGame)
initialsFormEl.addEventListener("submit", addNewScore)
highScoreLink.addEventListener("click", displayHighScores)
clearBtn.addEventListener("click", clearHighScores)
backBtn.addEventListener("click", goBack)