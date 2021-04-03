var pageContent = document.querySelector("#page-content");
var finishScreen = document.querySelector("#finish-screen");
finishScreen.style.display = "none";
var questionText = document.createElement("h1");
var index = 0;
var timer = 0;
var timerCount = 0;
var timerText = document.querySelector("#timer-text");
var gameRunning = false;

// Buttons
var viewScores = document.querySelector("#view-highscores");
viewScores.addEventListener("click", function(event) {
    event.preventDefault();
    printFinalBoard();
});
var gameStartButton = document.querySelector("#start-quiz");
gameStartButton.addEventListener("click", function(event) {
    event.preventDefault();
    gameStart();
});
var submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    logScoreInitials();
});

var questions = [
    {
        "question": "2 + 2 =",
        "correct": "4",
        "incorrect1": "5",
        "incorrect2": "1",
        "incorrect3": "2",
    },
    {
        "question": "Which color is complementary to red?",
        "correct": "Green",
        "incorrect1": "Blue",
        "incorrect2": "Yellow",
        "incorrect3": "Purple",
    },
    {
        "question": "2 x 3 =",
        "correct": "6",
        "incorrect1": "5",
        "incorrect2": "12",
        "incorrect3": "2",
    },
    {
        "question": "What does the 'T' in 'STEM' stand for?",
        "correct": "Technology",
        "incorrect1": "Terror",
        "incorrect2": "Ten",
        "incorrect3": "The",
    }
];

var score = {
    "initials": "",
    "points": 0
};

var highScoreBoard = [];

// Initialization function, clears page content and all data except local storage
function init() {
    questionText.textContent = "";
    index = 0;
    score.points = 0;
    timerCount = 20;
    while(pageContent.firstChild) {
        pageContent.removeChild(pageContent.firstChild);
    }
    finishScreen.style.display = "none";
}

function startTimer() {
    timer = setInterval(function() {
        if(gameRunning) {
            timerCount--;
            timerText.textContent = timerCount;
        }
        else {
            clearInterval(timer);
        }
        if(timerCount === 0) {
            clearInterval(timer);
            gameComplete();
        }
    }, 1000);
}

//Starts game
function gameStart() {
    init();
    gameRunning = true;
    startTimer();
    generateQuestion(questions[0]);
}

// Main function, generates page
function generateQuestion(inputObject) {    
    var randomizedArray;
    while(pageContent.firstChild) {
        pageContent.removeChild(pageContent.firstChild);
    }
    
    questionText.textContent = inputObject.question;
    pageContent.appendChild(questionText);

    var answers = document.createElement("div");
    answers.setAttribute("id", "answer-selection");
    var answer1 = document.createElement("button");
    var answer2 = document.createElement("button");
    var answer3 = document.createElement("button");
    var answer4 = document.createElement("button");

    answer1.textContent = inputObject.correct;
    answer2.textContent = inputObject.incorrect1;
    answer3.textContent = inputObject.incorrect2;
    answer4.textContent = inputObject.incorrect3;

    answer1.addEventListener("click", function(event) {
        event.preventDefault();
        rightAnswer();
        });
    answer2.addEventListener("click", function(event) {
        event.preventDefault();
        wrongAnswer();
        });
    answer3.addEventListener("click", function(event) {
        event.preventDefault();
        wrongAnswer();
        });
    answer4.addEventListener("click", function(event) {
        event.preventDefault();
        wrongAnswer();
        });

    randomizedArray = [answer1, answer2, answer3, answer4];
    randomizedArray = randomizeOrder(randomizedArray);

    answers.appendChild(randomizedArray[0]);
    answers.appendChild(randomizedArray[1]);
    answers.appendChild(randomizedArray[2]);
    answers.appendChild(randomizedArray[3]);
    pageContent.appendChild(answers);
}

// Function that takes array input and randomizes contents, returns randomized array
function randomizeOrder(inputArr) {
    var j, temp;
    for (var i = inputArr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = inputArr[i];
        inputArr[i] = inputArr[j];
        inputArr[j] = temp;
    }
    return inputArr;
}

// Functions that decide how game proceeds; either generating the next question or ending the game
function rightAnswer() {
    score.points++;
    index++;
    if(index<questions.length) {
        generateQuestion(questions[index]);
    }
    else {
        gameComplete();
    }
}

function wrongAnswer() {
    //Time --
    index++;
    if(index<questions.length) {
        generateQuestion(questions[index]);
    
    } else {
        gameComplete();
    }
}

// Finishes the game
function gameComplete() {
    gameRunning = false;
    while(pageContent.firstChild) {
        pageContent.removeChild(pageContent.firstChild);
    }
    finishScreen.style.display = "block";
}

function logScoreInitials() {
    finishScreen.style.display = "none";
    // Saves current score to score object
    var inputInitials = document.querySelector("#input-initials");
    score.initials = inputInitials.value.trim();
    if(score.points != null) {
        score.points = Math.round((score.points/index)*100);
    }
    else {
        score.points = 0;
    }
    
    // Saves score object to local high score board, and sorts it by score
    highScoreBoard = JSON.parse(localStorage.getItem("highScoreBoard") || "[]");
    highScoreBoard.push(score);
    highScoreBoard.sort((a,b) => {
        return (a.points < b.points);
    });
    localStorage.setItem("highScoreBoard", JSON.stringify(highScoreBoard));

    printFinalBoard();
}

function printFinalBoard() {
    init();
    highScoreBoard = JSON.parse(localStorage.getItem("highScoreBoard") || "[]");
    var allScores = document.createElement("ol");
    var currentScore;
    for(var i = 0; i < highScoreBoard.length; ++i) {
        if(highScoreBoard[i].points != null) {
            currentScore = document.createElement("li");
            currentScore.textContent = highScoreBoard[i].initials + " - " + highScoreBoard[i].points;
            allScores.appendChild(currentScore);
        }
    }
    pageContent.appendChild(allScores);

    var backbutton = document.createElement("button");
    backbutton.textContent = "Go Back";
    backbutton.addEventListener("click", function(event) {
        event.preventDefault();
        gameStart();
        });
    pageContent.appendChild(backbutton);

    var clearHighScore = document.createElement("button");
    clearHighScore.textContent = "Clear";
    clearHighScore.addEventListener("click", function(event){
        event.preventDefault();
        localStorage.clear();
        printFinalBoard();
    });
    pageContent.appendChild(clearHighScore);
}

// setInterval(function() { }, 1000); does function over 1 second