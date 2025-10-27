// --- DOM Element Selection ---
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// --- State Variables ---
let timerInterval = null; // Holds the setInterval ID
let startTime = 0;        // When the timer was started (in ms)
let elapsedTime = 0;      // Total time elapsed (in ms)
let isRunning = false;    // Timer status
let lapCounter = 1;       // Lap number

// --- Core Functions ---

function startTimer() {
    if (isRunning) return; // Prevent multiple timers

    isRunning = true;
    // Get start time by taking current time and subtracting any previously elapsed time
    // This allows "resume" to work correctly
    startTime = Date.now() - elapsedTime;

    // Update the timer display every 10 milliseconds
    timerInterval = setInterval(updateTime, 10);

    updateButtonStates();
}

function stopTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);
    
    // elapsedTime is already up-to-date from the last updateTime call
    updateButtonStates();
}

function resetTimer() {
    // Stop the timer if it's running
    if (isRunning) {
        clearInterval(timerInterval);
    }

    // Reset all state variables
    isRunning = false;
    elapsedTime = 0;
    startTime = 0;
    lapCounter = 1;

    // Reset display
    timerDisplay.innerHTML = '00:00:00<span class="milliseconds">.000</span>';
    
    // Clear laps
    lapsList.innerHTML = '';

    updateButtonStates();
}

function recordLap() {
    if (!isRunning) return; // Can't record a lap if timer isn't running

    const lapTime = formatTime(elapsedTime);
    
    const li = document.createElement('li');
    // Added <span> for better styling
    li.innerHTML = `<span>Lap ${lapCounter}</span><span>${lapTime}</span>`;
    
    // Add new lap to the top of the list
    lapsList.prepend(li);
    lapCounter++;
}

// --- Helper Functions ---

function updateTime() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime; // Total elapsed ms
    
    timerDisplay.innerHTML = formatTime(elapsedTime);
}

/**
 * Formats time in milliseconds into HH:MM:SS.ms string
 * @param {number} timeInMs - The time in milliseconds
 * @returns {string} - The formatted time string
 */
function formatTime(timeInMs) {
    let milliseconds = Math.floor((timeInMs % 1000));
    let seconds = Math.floor((timeInMs / 1000) % 60);
    let minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    let hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

    // Add leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

    // Return as a single string with the span for milliseconds
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}<span class="milliseconds">.${formattedMilliseconds}</span>`;
}

/**
 * Manages which buttons are enabled or disabled based on the timer's state.
 */
function updateButtonStates() {
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
    
    // *** THIS IS THE FIX ***
    // Reset should be enabled IF the timer is running OR if it's paused with time on it.
    // It should ONLY be disabled if the timer is at 0 and not running.
    resetBtn.disabled = (elapsedTime === 0 && !isRunning);
    
    // Lap button should only work while the timer is actively running.
    lapBtn.disabled = !isRunning;
}

/**
 * Toggles the 'dark-mode' class on the body and updates the button icon.
 */
function toggleTheme() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️'; // Sun icon
    } else {
        themeToggle.textContent = '🌙'; // Moon icon
    }
}

// --- Event Listeners ---
// Initialize button states on page load
updateButtonStates(); 

// Add click handlers
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);
