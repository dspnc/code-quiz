//query selectors set as variables for DOM manipulation below
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

//index for iterating through question array, start with 0
var index = 0

//starting score set to 0
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


//hides home page and displays the question display before starting the timer and serving a new question
function startGame() {
    homeContainerEl.classList.add("hidden")
    homeContainerEl.classList.remove("visible")
    questionContainerEl.classList.add("visible")
    questionContainerEl.classList.remove("hidden")
    setTime()
    newQuestion()
}

//clears answers that may be present from previous question and shows the question based on the index
function newQuestion() {
    removeAnswers()
    showQuestion(quizQuestions[index])
}

//removes answer button elements that were added, if any
function removeAnswers(){
    for (var i= answerEl.children.length; i>0; i--) {
        answerEl.removeChild(answerEl.firstChild)
    }
}


//creates answer buttons by iterating through the current index's option keys, calls checkAnswer on click
function showQuestion(index) {
    questionEl.textContent = index.q;
    for (var i=0; i<index.options.length; i++) {
        var answerButton = document.createElement("button");
        answerButton.innerHTML = index.options[i].option;
        answerButton.addEventListener("click", checkAnswer);
        answerEl.appendChild(answerButton);
    };
};

//compares the clicked answer button content to the options value that corresponds with the index. if it matches, call correctAnswer. else, WrongAnswer and adjusts score
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

//shows the Correct text when an answer is clicked correctly, and hides the Wrong text
function correctAnswer(){
    if (correctEl.className == "hidden") {
        correctEl.classList.remove("hidden")
        correctEl.classList.add("visible")
        wrongEl.classList.remove("visible")
        wrongEl.classList.add("hidden")
    }
}

//shows the Wrong text when an answer is clicked incorrectly, and hides the Correct Text
function wrongAnswer(){
    if (wrongEl.className == "hidden") {
        wrongEl.classList.remove("hidden")
        wrongEl.classList.add("visible")
        correctEl.classList.remove("visible")
        correctEl.classList.add("hidden")
    }
}

//hides all containers and content except the complete-container content and the final score
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

//upon entering initials, adds initials and score to highScoresList, clears previous list and generates updated list with new value
//then calls saveScore and displayHighScores
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


//saves highScoresList to local storage
function saveScore() {
    localStorage.setItem("High-Scores", JSON.stringify(highScoresList))
}

//hides all but the high scores list and its container elements
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

//resets highScoresList, removes list from page and clears local storage
function clearHighScores() {
    highScoresList = []

    while (scoresListEl.firstChild) {
        scoresListEl.removeChild(scoresListEl.firstChild)
    }
    localStorage.clear(highScoresList)

   
}

//loads high scores from storage and adds them to the scores list element
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

//hides high score page and shows the start page with the index, score, and timer reset
function goBack(){
    highScoreEl.classList.remove("visible")
    highScoreEl.classList.add("hidden")
    homeContainerEl.classList.remove("hidden")
    homeContainerEl.classList.add("visible")
    index = 0;
    score = 0;
    secondsLeft = 50;

}

//loads local storage upon running
loadScores()

//start button to trigger timer and newQuestion
startBtnEl.addEventListener("click", startGame)

//submit button for entering initials and score
initialsFormEl.addEventListener("submit", addNewScore)

//link for View High Scores in the header
highScoreLink.addEventListener("click", displayHighScores)

//clears high scores on click
clearBtn.addEventListener("click", clearHighScores)

//goes back to start page on click
backBtn.addEventListener("click", goBack)