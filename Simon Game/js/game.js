let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let isGameStarted = false;

// Variables for sounds.
let redSound = new Audio("sounds/red.mp3");
let blueSound = new Audio("sounds/blue.mp3");
let greenSound = new Audio("sounds/green.mp3");
let yellowSound = new Audio("sounds/yellow.mp3");
let wrongSound = new Audio("sounds/wrong.mp3");

// Add event listeners to the buttons
$(".btn").on("click", (clickEvent) => {buttonHandler(clickEvent)});

// Add event listener to the entire document to detect the first key press(only once).
$(document).one("keypress", nextSequence);

/**
 * Play sound when new sequence is generated or a button is pressed.
 * @param {*} button 
 */
function playSound(button) {
    switch (button) {
        case "red":
            redSound.play();
            break;

        case "blue":
            blueSound.play();
            break;

        case "green":
            greenSound.play();
            break;

        case "yellow":
            yellowSound.play();
            break;
    
        default:
            console.log(`${button} is not recognized as valid entry.`);
            break;
    }
}

/**
 * Receives the color of the current button pressed and animates it for
 * an interval of 100ms.
 * @param {*} currentColor 
 */
function animatePress(currentColor) {
    $(`#${currentColor}`).addClass("pressed");

    setTimeout(() => {
        $(`#${currentColor}`).removeClass("pressed");
    }, 100);
}

/**
 * Generates sequence and add it to the pattern to follow.
 */
function nextSequence() {
    // Start game flag set.
    isGameStarted = true;

    let randomNumber = Math.floor(Math.random() * 4);

    // Display level.
    level++;
    $("#level-title").text(`Level ${level}`);
    
    
    // Get random color
    let randomChosenColor = buttonColors[randomNumber];

    // Add color to the pattern.
    gamePattern.push(randomChosenColor);

    // Animate selected button in pattern.
    $(`#${randomChosenColor}`).fadeOut(100).fadeIn(100);

    // Reproduce sound for new generated color in pattern.
    playSound(randomChosenColor);
}

/**
 * When the user press a button this function checks if the sequence is correct.
 * If user entry is wrong, the game isa finished, and it's set to its initial state.
 * @param {*} index 
 */
function checkAnswer(index) {
    if (gamePattern[index] === userClickedPattern[index]) {

        // Check if user finished with the input sequence. If so, it waits
        // 1s to call the next sequence.
        if (gamePattern.length === userClickedPattern.length)  {
            setTimeout(() => {
                nextSequence();
                userClickedPattern = [];
            }, 1000);
        } else {
            console.log("Pattern not finished.");
        }
    } else {
        // When user get a wrong sequence, a class is added for 200ms and a sound is
        // reproduced.
        wrongSound.play();

        $("body").addClass("game-over");
        setInterval(() => {
            $("body").removeClass("game-over");
        }, 200);

        // Game over message.
        $("#level-title").text("Game Over, Press Any Key to Restart");

        // Remove event listeners from the buttons.
        $(".btn").off("click");

        // Game started set to false.
        isGameStarted = false;

        // Restart the game.
        startOver();
    }
}

/**
 * Handles the click event on every button. It identifies which button
 * was pressed, and add that id to an array where the pattern selected
 * by the user is stored.
 * @param {*} event 
 */
function buttonHandler(event) {
    if (isGameStarted) {
        // Store the id of the button clicked.
        userChosenColor = event.target.id;
        console.log(userChosenColor);
        // console.log(event);

        // Add the last button clicked by the user to the sequence clicked by user.
        userClickedPattern.push(userChosenColor);
        console.log(userClickedPattern);

        // Reproduce sound and animates the button clicked.
        playSound(userChosenColor);
        animatePress(userChosenColor);

        // Check user answer. Send index of last element added to the pattern.
        checkAnswer(userClickedPattern.length - 1);
    }
}

/**
 * Restart game to its initial state.
 */
function startOver() {
    // Add event listener to the entire document to detect the first key press(only once).
    $(document).one("keypress", nextSequence);

    // Add event listeners to the buttons
    $(".btn").on("click", (clickEvent) => {buttonHandler(clickEvent)});

    // Reset level.
    level = 0;

    // Reset game pattern.
    gamePattern = [];

    // Reset user pattern.
    userClickedPattern = [];
}