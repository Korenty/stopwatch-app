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
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapCounter = 1;

// --- Core Functions ---

function startTimer() {
    if (isRunning) return; // Prevent multiple intervals

    isRunning = true;
    // Date.now() is ms since epoch.
    // Subtracting elapsedTime ensures we resume from where we left off.
    startTime = Date.now() - elapsedTime;

    // Update time every 10ms for smooth millisecond display
    timerInterval = setInterval(updateTime, 10);

    updateButtonStates();
}

function stopTimer() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timerInterval);
    
    // We already have the total elapsedTime from the updateTime function
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
    li.innerHTML = `<span>Lap ${lapCounter}:</span> ${lapTime}`;
    
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

function formatTime(timeInMs) {
    // Calculate hours, minutes, seconds, and milliseconds
    let milliseconds = Math.floor((timeInMs % 1000));
    let seconds = Math.floor((timeInMs / 1000) % 60);
    let minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    let hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

    // Format with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}<span class="milliseconds">.${formattedMilliseconds}</span>`;
}

function updateButtonStates() {
    startBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;
    resetBtn.disabled = elapsedTime === 0;
    lapBtn.disabled = !isRunning;
}

function toggleTheme() {
    body.classList.toggle('dark-mode');

    // Update toggle button icon
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️'; // Sun icon for light mode
    } else {
        themeToggle.textContent = '🌙'; // Moon icon for dark mode
    }
}

// --- Event Listeners ---
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);
