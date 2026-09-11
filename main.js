const target = document.getElementById('target');
const arena = document.getElementById('arena');
const btnDemarrer = document.getElementById('start');
const counter = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const missesDisplay = document.getElementById('misses');
const accuracyDisplay = document.getElementById('accuracy');
const bestScoreDisplay = document.getElementById('best-score');
const resultMessage = document.getElementById('result-message');
const historyList = document.getElementById('history');

const configForm = document.getElementById('config-form');
const viewConfig = document.getElementById('view-config');
const viewGame = document.getElementById('view-game');

let score = 0;
let misses = 0;
let temps = 10;
let timerId = null;
let isRunning = false;

let selectedMode = 'classique';
let selectedDuration = 10;
let selectedDifficulty = 'moyenne';

const TARGET_SIZES = { facile: 80, moyenne: 60, difficile: 40 };

target.style.display = 'none';

document.querySelectorAll('.pill-group').forEach(group => {
  group.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (group.id === 'mode-group') selectedMode = pill.dataset.value;
      if (group.id === 'duration-group') selectedDuration = Number(pill.dataset.value);
      if (group.id === 'difficulty-group') selectedDifficulty = pill.dataset.value;
    });
  });
});

configForm.addEventListener('submit', (e) => {
  e.preventDefault();

  viewConfig.hidden = true;
  viewGame.hidden = false;

  afficherMeilleurScore();
  afficherHistorique();
});
function placerCible() {
  const taille = TARGET_SIZES[selectedDifficulty];
  target.style.width = taille + 'px';
  target.style.height = taille + 'px';

  const champDeplacement = arena.clientWidth;

  const i = Math.floor(Math.random() * (champDeplacement - taille));
  const j = Math.floor(Math.random() * (champDeplacement - taille));

  target.style.left = i + 'px';
  target.style.top = j + 'px';
}
target.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!isRunning) return;

  score++;
  scoreDisplay.textContent = score;
  placerCible();
  mettreAJourPrecision();
});

arena.addEventListener('click', () => {
  if (!isRunning) return;

  if (selectedMode === 'precision') {
    misses++;
    missesDisplay.textContent = misses;
    mettreAJourPrecision();
  }
});

function mettreAJourPrecision() {
  if (selectedMode !== 'precision') {
    accuracyDisplay.textContent = '—';
    return;
  }
  const total = score + misses;
  const precision = total === 0 ? 0 : Math.round((score / total) * 1000) / 10;
  accuracyDisplay.textContent = precision + '%';
}

btnDemarrer.addEventListener('click', () => {
  if (isRunning) {
    arreterPartie();
    return;
  }
  score = 0;
  misses = 0;
  temps = selectedDuration;
  isRunning = true;

  scoreDisplay.textContent = score;
  missesDisplay.textContent = misses;
  accuracyDisplay.textContent = selectedMode === 'precision' ? '0%' : '—';
  counter.textContent = temps;
  resultMessage.textContent = '';

  target.style.display = 'block';
  btnDemarrer.textContent = 'Arrêter';
  placerCible();

  timerId = setInterval(() => {
    temps--;
    counter.textContent = temps;

    if (temps <= 0) {
      arreterPartie();
    }
  }, 1000);
});
function arreterPartie() {
  clearInterval(timerId);
  timerId = null;
  isRunning = false;

  target.style.display = 'none';
  btnDemarrer.textContent = 'Démarrer';

  resultMessage.textContent = 'Votre score final est : ' + score;

  mettreAJourMeilleurScore();
  ajouterAHistorique();
}
function mettreAJourMeilleurScore() {
  const bestScoreActuel = Number(localStorage.getItem('bestScore')) || 0;

  if (score > bestScoreActuel) {
    localStorage.setItem('bestScore', score);
  }

  afficherMeilleurScore();
}

