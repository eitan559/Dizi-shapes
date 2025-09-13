const shapesByLevel = [
    ['עיגול', 'ריבוע', 'משולש', 'כוכב'], // שלב 1
    ['עיגול', 'ריבוע', 'משולש', 'כוכב', 'מלבן', 'חצי עיגול'], // שלב 2
    ['עיגול', 'ריבוע', 'משולש', 'כוכב', 'מלבן', 'חצי עיגול', 'טרפז', 'משושה'] // שלב 3
];
const shapeFiles = {
    'עיגול': 'circle.mp3',
    'ריבוע': 'square.mp3',
    'משולש': 'triangle.mp3',
    'כוכב': 'star.mp3',
    'מלבן': 'rectangle.mp3',
    'חצי עיגול': 'semicircle.mp3',
    'טרפז': 'trapezoid.mp3',
    'משושה': 'hexagon.mp3'
};
const shapeImages = {
    'עיגול': 'circle.svg',
    'ריבוע': 'square.svg',
    'משולש': 'triangle.svg',
    'כוכב': 'star.svg',
    'מלבן': 'rectangle.svg',
    'חצי עיגול': 'semicircle.svg',
    'טרפז': 'trapezoid.svg',
    'משושה': 'hexagon.svg'
};
const shapeAudio = document.getElementById('shape-audio');
const feedbackAudio = document.getElementById('feedback-audio');
const feedback = document.getElementById('feedback');
const speechBubble = document.getElementById('speech-bubble');
const scoreValue = document.getElementById('score-value');
const mistakes = document.getElementById('mistakes');
const level = document.getElementById('level');
const timeLeft = document.getElementById('time-left');
const shapeButtons = document.getElementById('shape-buttons');
const gameOverScreen = document.getElementById('game-over');
const gameOverText = document.getElementById('game-over-text');
const restartButton = document.getElementById('restart-button');
const nextLevelButton = document.getElementById('next-level-button');
const homeButton = document.getElementById('home-button');
const confettiCanvas = document.getElementById('confetti-canvas');
const loginScreen = document.getElementById('login-screen');
const gameContainer = document.getElementById('game-container');
const usernameInput = document.getElementById('username');
const startGameButton = document.getElementById('start-game');
const usernameDisplay = document.getElementById('username-display');
let correctShape, score = 0, mistakeCount = 0, currentLevel = 0, timeLimit = 8000;
let gameActive = false, timerInterval, username = '', buttons = [];

startGameButton.addEventListener('click', () => {
    username = usernameInput.value.trim() || 'שחקן אנונימי';
    if (username) {
        usernameDisplay.textContent = username;
        loginScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        startNextLevel();
    }
});

function startNextLevel() {
    if (currentLevel >= shapesByLevel.length) {
        gameOverScreen.style.display = 'flex';
        gameOverText.textContent = `${username}, סיימת את כל השלבים! כל הכבוד!`;
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        });
        restartButton.style.display = 'block';
        nextLevelButton.style.display = 'none';
        return;
    }
    currentLevel++;
    score = 0;
    mistakeCount = 0;
    timeLimit = 8000 - (currentLevel - 1) * 1500; // זמן קצר יותר בכל שלב
    scoreValue.textContent = score;
    mistakes.textContent = mistakeCount;
    level.textContent = currentLevel;
    updateShapeButtons();
    gameActive = true;
    startNewRound();
}

function updateShapeButtons() {
    const currentShapes = shapesByLevel[currentLevel - 1];
    shapeButtons.innerHTML = '';
    buttons = [];

    currentShapes.forEach((shape) => {
        const button = document.createElement('button');
        button.className = 'shape-button';
        button.setAttribute('data-shape', shape);
        button.style.backgroundImage = `url('${shapeImages[shape]}')`;
        shapeButtons.appendChild(button);
        buttons.push(button);
    });

    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

function handleButtonClick() {
    if (!gameActive) return;
    const selectedShape = this.getAttribute('data-shape');
    if (selectedShape === correctShape) {
        score++;
        scoreValue.textContent = score;
        feedback.textContent = 'נכון! כל הכבוד!';
        speechBubble.style.display = 'none';
        clearInterval(timerInterval);
        feedbackAudio.src = 'correct.mp3';
        feedbackAudio.play().catch(() => {});
        if (score < 5) {
            setTimeout(startNewRound, 1000);
        } else {
            checkGameOver();
        }
    } else {
        mistakeCount++;
        mistakes.textContent = mistakeCount;
        feedback.textContent = 'טעות! נסה שוב.';
        feedbackAudio.src = 'wrong.mp3';
        feedbackAudio.play().catch(() => {});
        checkGameOver();
    }
}

function startNewRound() {
    if (!gameActive) return;
    const currentShapes = shapesByLevel[currentLevel - 1];
    correctShape = currentShapes[Math.floor(Math.random() * currentShapes.length)];
    shapeAudio.src = shapeFiles[correctShape];
    shapeAudio.play();
    speechBubble.textContent = `${username}, בחר ${correctShape}!`;
    speechBubble.style.display = 'block';
    feedback.textContent = '';
    let timeRemaining = timeLimit / 1000;
    timeLeft.textContent = timeRemaining;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        timeLeft.textContent = timeRemaining;
        if (timeRemaining <= 0 && gameActive) {
            clearInterval(timerInterval);
            mistakeCount++;
            mistakes.textContent = mistakeCount;
            feedback.textContent = 'הזמן נגמר! נסה שוב.';
            feedbackAudio.src = 'wrong.mp3';
            feedbackAudio.play().catch(() => {});
            checkGameOver();
        }
    }, 1000);
}

function checkGameOver() {
    if (score >= 5) {
        gameActive = false;
        clearInterval(timerInterval);
        gameOverScreen.style.display = 'flex';
        if (currentLevel < shapesByLevel.length) {
            gameOverText.textContent = `${username}, עברת את השלב ${currentLevel}! כל הכבוד!`;
            feedbackAudio.src = 'win.mp3';
            feedbackAudio.play().catch(() => {});
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            nextLevelButton.style.display = 'block';
            restartButton.style.display = 'none';
            homeButton.style.display = 'none';
        } else {
            gameOverText.textContent = `${username}, סיימת את כל השלבים! כל הכבוד!`;
            feedbackAudio.src = 'win.mp3';
            feedbackAudio.play().catch(() => {});
            confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 }
            });
            nextLevelButton.style.display = 'none';
            restartButton.style.display = 'block';
            homeButton.style.display = 'block';
        }
    } else if (mistakeCount >= 3) {
        gameActive = false;
        clearInterval(timerInterval);
        gameOverScreen.style.display = 'flex';
        gameOverText.textContent = `${username}, הפסדת בשלב ${currentLevel}! נסה שוב!`;
        feedbackAudio.src = 'lost.mp3';
        feedbackAudio.play().catch(() => {});
        nextLevelButton.style.display = 'none';
        restartButton.style.display = 'block';
        homeButton.style.display = 'block';
    }
}

nextLevelButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    startNextLevel();
});

restartButton.addEventListener('click', () => {
    score = 0;
    mistakeCount = 0;
    currentLevel = 0;
    scoreValue.textContent = score;
    mistakes.textContent = mistakeCount;
    level.textContent = currentLevel;
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'none';
    loginScreen.style.display = 'flex';
    usernameInput.value = '';
    gameActive = false;
});

homeButton.addEventListener('click', () => {
    window.location.href = 'main_index.html'; // חזרה לדף המשחקים הראשי
});