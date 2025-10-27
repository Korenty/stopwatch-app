// script.js: JavaScript Logic for the Minimalist Stopwatch

// ----------------------
// 1. DOM Elements
// ----------------------
const timerDisplay = document.getElementById('timer');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn'); // The "CLEAR" text
const aboutLink = document.getElementById('aboutLink');


// ----------------------
// 2. Timer Variables
// ----------------------
let startTime = 0;
// We'll only track milliseconds, as the display only shows H:M:S
let elapsedTime = 0; 
let timerInterval = null;
let isRunning = false;


// ----------------------
// 3. Formatting Functions
// ----------------------

// Pad numbers with leading zeros (e.g., 5 -> 05)
function pad(num) {
    return num < 10 ? `0${num}` : num;
}

/**
 * Converts milliseconds to HH:MM:SS format (as per the image design).
 * We will ignore milliseconds in the display, but track them internally.
 */
function formatTime(ms) {
    // Only hours, minutes, seconds are visible on the display
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    // The format required by the display is HH:MM:SS
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


// ----------------------
// 4. Stopwatch Logic
// ----------------------

/**
 * Toggles between Start and Stop functionality.
 */
function startStop() {
    if (isRunning) {
        // Current state is running -> Stop the timer
        stopTimer();
    } else {
        // Current state is stopped -> Start the timer
        startTimer();
    }
}

/**
 * Starts the timer.
 */
function startTimer() {
    isRunning = true;
    
    // Set the startTime relative to the current time minus any elapsed time
    startTime = Date.now() - elapsedTime;
    
    // Update the display at a precise interval (1000ms for seconds)
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000); // 1-second interval for H:M:S display
    
    // Update button text to reflect the next action
    startStopBtn.textContent = 'stop';
}

/**
 * Pauses the timer.
 */
function stopTimer() {
    isRunning = false;
    
    // Stop the timer loop
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Update button text to reflect the next action
    startStopBtn.textContent = 'start/stop';
}

/**
 * Resets the timer to 00:00:00.
 */
function resetTimer() {
    // Stop the timer, but only if it's currently running
    if (isRunning) {
        stopTimer();
    }

    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
    startStopBtn.textContent = 'start/stop'; // Ensure button is set to initial text
}

/**
 * Toggles the dark/light theme (Bonus feature, triggered by "About").
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}


// ----------------------
// 5. Event Listeners
// ----------------------

// Single button handles both start and stop
startStopBtn.addEventListener('click', startStop);

// "CLEAR" text acts as the reset button
resetBtn.addEventListener('click', resetTimer);

// "About" link triggers the dark/light theme toggle
aboutLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the link from jumping the page
    toggleTheme();
});

// Initial state setup
resetTimer(); 
