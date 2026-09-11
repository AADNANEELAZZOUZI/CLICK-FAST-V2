let target = document.getElementById('target');
let champDeplacement = document.getElementById('arena').clientWidth;
let score = 0;
let btnDemarrer = document.getElementById('start');
let counter = document.getElementById('time');
let scoreFinal = document.getElementById('score');
let gameContainer = document.getElementById('view-game');
let configContainer = document.getElementById('view-config');
let configForm = document.getElementById('config-form');




target.style.display = 'none';
target.addEventListener('click',() => {
        var i = Math.floor(Math.random()*(champDeplacement - 50));
    var j = Math.floor(Math.random()*(champDeplacement - 50));
    target.style.left = i+"px";
    target.style.top = j+"px";
    score++;
    document.getElementById('score').textContent = score;
});

btnDemarrer.addEventListener('click', () => {

    if (btnDemarrer.textContent === 'arrêter') {

        clearInterval(timer);
        target.style.display = 'none';
        btnDemarrer.textContent = 'démarrer';

    } else {

        score = 0;
        temps = 10;

        document.getElementById('score').textContent = score;
        counter.textContent = temps;

        target.style.display = 'block';
        btnDemarrer.textContent = 'arrêter';

        timer = setInterval(() => {

            temps--;

            counter.textContent = temps;

            if (temps === 0) {

                clearInterval(timer);

                target.style.display = 'none';
                btnDemarrer.textContent = 'démarrer';
                scoreFinal.textContent = "Votre score final est : " + score;
                let bestScore = localStorage.setItem('bestScore',score);
                if (score = null || score > Number(bestScore)) {
                    localStorage.setItem('bestScore', score);
                    document.getElementById('best-score').textContent = score;
                }
            }

        }, 1000);
    }
});