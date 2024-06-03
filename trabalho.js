document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("restartGame").addEventListener("click", resetGame);

let currentPlayer = 1;
let scores = [0, 0];
let firstCard = null;
let secondCard = null;

function startGame() {
    const player1Name = document.getElementById("player1").value || "Equipe 1";
    const player2Name = document.getElementById("player2").value || "Equipe 2";
    const difficulty = parseInt(document.getElementById("difficulty").value);

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    document.getElementById("team1").textContent = `${player1Name}: 0 pontos`;
    document.getElementById("team2").textContent = `${player2Name}: 0 pontos`;

    const equations = generateEquations(difficulty);
    setupBoard(equations);
}

function generateEquations(difficulty) {
    let equations = [];
    let range = difficulty * 10;

    for (let i = 0; i < 8; i++) {
        let a = Math.floor(Math.random() * range) + 1;
        let b = Math.floor(Math.random() * range) + 1;
        let equation, answer;

        switch (difficulty) {
            case 1:
                equation = `${a} + ${b}`;
                answer = a + b;
                break;
            case 2:
                equation = `${a} - ${b}`;
                answer = a - b;
                break;
            case 3:
                equation = `${a} * ${b}`;
                answer = a * b;
                break;
            case 4:
                equation = `${a} / ${b}`;
                answer = (a / b).toFixed(2);
                break;
            case 5:
                const op = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
                switch (op) {
                    case "+":
                        equation = `${a} + ${b}`;
                        answer = a + b;
                        break;
                    case "-":
                        equation = `${a} - ${b}`;
                        answer = a - b;
                        break;
                    case "*":
                        equation = `${a} * ${b}`;
                        answer = a * b;
                        break;
                    case "/":
                        equation = `${a} / ${b}`;
                        answer = (a / b).toFixed(2);
                        break;
                }
                break;
        }

        equations.push({ question: equation, answer: answer });
        equations.push({ question: `${answer}`, answer: answer });
    }

    return shuffle(equations);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupBoard(equations) {
    const board = document.getElementById("board");
    board.innerHTML = "";

    equations.forEach((equation, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;
        card.dataset.answer = equation.answer;
        card.textContent = equation.question;
        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (!firstCard) {
        firstCard = card;
        card.classList.add("flipped");
    } else if (firstCard && !secondCard && card !== firstCard) {
        secondCard = card;
        card.classList.add("flipped");

        if (firstCard.dataset.answer === secondCard.dataset.answer) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            showSuccess();
            updateScore();
        } else {
            setTimeout(showError, 500);
        }
    }
}

function showSuccess() {
    document.getElementById("message").textContent = "Acertou!";
    setTimeout(() => {
        document.getElementById("message").textContent = "";
    }, 1000);
}

function showError() {
    document.getElementById("message").textContent = "Errou! Passa para o próximo jogador.";
    setTimeout(resetCards, 1000);
}

function resetCards() {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard = null;
    secondCard = null;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById("message").textContent = "";
}

function updateScore() {
    scores[currentPlayer - 1]++;
    document.getElementById("team1").textContent = `${document.getElementById("player1").value || "Equipe 1"}: ${scores[0]} pontos`;
    document.getElementById("team2").textContent = `${document.getElementById("player2").value || "Equipe 2"}: ${scores[1]} pontos`;

    firstCard = null;
    secondCard = null;

    if (scores.reduce((a, b) => a + b) === 8) {
        declareWinner();
    }
}

function declareWinner() {
    const player1Name = document.getElementById("player1").value || "Equipe 1";
    const player2Name = document.getElementById("player2").value || "Equipe 2";

    let winnerMessage;
    if (scores[0] > scores[1]) {
        winnerMessage = `O vencedor é ${player1Name} com ${scores[0]} pontos!`;
    } else if (scores[1] > scores[0]) {
        winnerMessage = `O vencedor é ${player2Name} com ${scores[1]} pontos!`;
    } else {
        winnerMessage = `O jogo terminou empatado com ${scores[0]} pontos para cada equipe!`;
    }

    document.getElementById("winnerMessage").textContent = winnerMessage;
    document.getElementById("game").classList.add("hidden");
    document.getElementById("winnerScreen").classList.remove("hidden");
}

function resetGame() {
    scores = [0, 0];
    currentPlayer = 1;
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("winnerScreen").classList.add("hidden");
}
