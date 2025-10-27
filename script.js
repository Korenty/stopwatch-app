// DOM elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('laps');
const themeToggle = document.getElementById('themeToggle');

// Timer variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

// Format time (hours, minutes, seconds, milliseconds)
function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000));
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padMs(milliseconds)}`;
}

// Pad numbers with leading zeros
function pad(num) {
    return num < 10 ? `0${num}` : num;
}

function padMs(num) {
    return num < 100 ? (num < 10 ? `00${num}` : `0${num}`) : num;
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timerDisplay.textContent = formatTime(elapsedTime);
        }, 10); // Update every 10ms for millisecond precision
    }
}

// Stop timer
function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
    }
}

// Reset timer
function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00.000';
    lapsList.innerHTML = ''; // Clear lap times
}

// Record lap time
function recordLap() {
    if (isRunning) {
        const lapTime = formatTime(elapsedTime);
        const lapItem = document.createElement('p');
        lapItem.textContent = `Lap ${lapsList.children.length + 1}: ${lapTime}`;
        lapsList.appendChild(lapItem);
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark');
}

// Event listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
themeToggle.addEventListener('click', toggleTheme);
