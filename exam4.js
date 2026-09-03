const GAME_TIME = 20;
const HIGH_SCORE_KEY = 'typingGameHighScore';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let score = 0;
let timeLeft = GAME_TIME;
let gameInterval;
let isGameRunning = false;

const targetCharElement = document.getElementById('targetChar');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const timerElement = document.getElementById('timer');
const answerInput = document.getElementById('answerInput');
const feedbackElement = document.getElementById('feedback');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function getRandomChar() {
    return characters[Math.floor(Math.random() * characters.length)];
}

function setNewTargetChar() {
    targetCharElement.textContent = getRandomChar();
}

function updateScore() {
    scoreElement.textContent = score;
}

function checkInput() {
    if (!isGameRunning || answerInput.value.length === 0) return;

    const isCorrect = answerInput.value === targetCharElement.textContent;
    score = Math.max(0, score + (isCorrect ? 10 : -5));
    updateScore();
    answerInput.className = isCorrect ? 'correct' : 'incorrect';
    feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackElement.textContent = isCorrect ? '정확합니다! +10' : '다릅니다. -5';
    setNewTargetChar();
    answerInput.focus();
    answerInput.select();
}

function updateTimer() {
    timeLeft -= 1;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
}

function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    answerInput.disabled = true;
    startButton.hidden = false;
    targetCharElement.textContent = '-';
    timerElement.textContent = '종료';
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = `게임 종료! 최종 점수는 ${score}점입니다.`;

    const highScore = Math.max(Number(localStorage.getItem(HIGH_SCORE_KEY) || 0), score);
    localStorage.setItem(HIGH_SCORE_KEY, highScore);
    highScoreElement.textContent = highScore;
}

function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    score = 0;
    timeLeft = GAME_TIME;
    updateScore();
    timerElement.textContent = timeLeft;
    answerInput.disabled = false;
    answerInput.value = '';
    answerInput.className = '';
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = '입력하면 바로 판정됩니다.';
    setNewTargetChar();
    startButton.hidden = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateTimer, 1000);
    answerInput.focus();
}

function resetGame() {
    clearInterval(gameInterval);
    isGameRunning = false;
    score = 0;
    timeLeft = GAME_TIME;
    updateScore();
    timerElement.textContent = timeLeft;
    targetCharElement.textContent = '-';
    answerInput.value = '';
    answerInput.className = '';
    answerInput.disabled = true;
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = '시작 버튼을 눌러 게임을 시작하세요.';
    startButton.hidden = false;
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
answerInput.addEventListener('input', checkInput);
highScoreElement.textContent = localStorage.getItem(HIGH_SCORE_KEY) || 0;