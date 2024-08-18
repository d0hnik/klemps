let players = [];
let deck = [];
let currentPlayerIndex = 0;
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function setupPlayers() {
    const playerCount = document.getElementById('player-count').value;
    const nameInputsDiv = document.getElementById('name-inputs');
    nameInputsDiv.innerHTML = '';

    for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-${i}`;
        input.placeholder = `Mängija ${i} nimi`;
        nameInputsDiv.appendChild(input);
        nameInputsDiv.appendChild(document.createElement('br'));
    }

    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('description').style.display = 'none';
    document.getElementById('name-setup').style.display = 'flex';
}

function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']; // Südamed, ruutud, ristikud, ärtud

    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }

    // Sega kaardipakk
    deck = shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dealCards() {
    for (let i = 0; i < 4; i++) { // Jagatakse 4 kaarti igale mängijale
        players.forEach(player => {
            player.cards.push(deck.pop());
            console.log(player.cards[i])
        });
    }
}

function startGame() {
    const playerCount = document.getElementById('player-count').value;

    // Loome mängijate nimekirja
    for (let i = 1; i <= playerCount; i++) {
        const playerName = document.getElementById(`player-${i}`).value;
        players.push({ name: playerName, cards: [] });
    }

    // Loome kaardipaki
    createDeck();

    // Jagame igale mängijale neli kaarti
    dealCards();

    document.getElementById('name-setup').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    firstMove()
}

function firstMove() {
    let i = 0;
    const currentPlayer = players[currentPlayerIndex];
    const playersDiv = document.getElementById('players');
    const playerDiv = document.createElement('div');
    const nextMoveButton = document.createElement('button');
    nextMoveButton.setAttribute('onclick', 'displayColorChoice()');
    nextMoveButton.className = 'nextMoveButton';
    nextMoveButton.innerText = "Keera kaarti";
    nextMoveButton.id = `${currentPlayer.name} btn`
    playerDiv.className = 'player-title';
    playerDiv.id = `${currentPlayer.name}`;
    const playerCardsDiv = document.createElement('div');
    playerCardsDiv.className = 'cards';
    currentPlayer.cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'cardBack redBack'
        cardDiv.id = `${currentPlayer.name} ${i}`;
        playerCardsDiv.appendChild(cardDiv);
        i++;
    })
    let name = currentPlayer.name.toUpperCase();
    playerDiv.innerHTML = `<p>${name} SINU KORD</p>`
    playerDiv.appendChild(playerCardsDiv);
    playersDiv.appendChild(playerDiv);
    playerDiv.appendChild(nextMoveButton);
    
}

function displayColorChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function checkColorChoice(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const cardSuit = currentPlayer.cards[0].suit;
    const cardValue = currentPlayer.cards[0].value;
    if (choice === "red") {
        if (cardSuit === "hearts" || cardSuit === 'diamonds') {
            const cardToChange = document.getElementById(`${currentPlayer.name} ${0}`);
            cardToChange.className = `card ${cardSuit}${cardValue}`
            rightGuess('2', "")
        }
        else {
            const cardToChange = document.getElementById(`${currentPlayer.name} ${0}`);
            cardToChange.className = `card ${cardSuit}${cardValue}`
            wrongGuess('2', "")
        }
    }
    else {
        if (cardSuit === "spades" || cardSuit === "clubs") {
            const cardToChange = document.getElementById(`${currentPlayer.name} ${0}`);
            cardToChange.className = `card ${cardSuit}${cardValue}`
            rightGuess('2', "")
        }
        else {
            const cardToChange = document.getElementById(`${currentPlayer.name} ${0}`);
            cardToChange.className = `card ${cardSuit}${cardValue}`
            wrongGuess('2', "")
        }
    }

    setTimeout(function() {
        currentPlayerIndex++;
        document.getElementById(`${currentPlayer.name}`).style.display = 'none';
        
        if (currentPlayerIndex < players.length) {
            firstMove();
        }
        else {
            currentPlayerIndex = 0;
            nextMove('displayHigherLowerChoice()')
        }
    }, 6000);


}

function wrongGuess(amountToDrink, popupId) {
    document.getElementById(`popup${popupId}`).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup3').style.display = 'block';
        document.getElementById('drinks-lose').textContent = `${amountToDrink}`
    }, 1000);

    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup3').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    }, 5000);
}

function rightGuess(amountToDrink, popupId) {
    document.getElementById(`popup${popupId}`).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup2').style.display = 'block';
        document.getElementById('drinks-win').textContent = `${amountToDrink}`
    }, 1000);

    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup2').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    }, 5000);
}

function nextMove(btnFunction) {
    const currentPlayer = players[currentPlayerIndex];
    const playerDiv = document.getElementById(`${currentPlayer.name}`);
    playerDiv.style.display = 'block';
    const btn = document.getElementById(`${currentPlayer.name} btn`);
    btn.setAttribute('onclick', `${btnFunction}`);
}

function displayHigherLowerChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup4').style.display = 'block';
}

function getCardValue(card) {
    return values.indexOf(card);
}

function checkHigherLowerChoice(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const prevCard = currentPlayer.cards[0];
    const currCard = currentPlayer.cards[1];
    
    if (choice === 'higher') {
        if (getCardValue(prevCard.value) < getCardValue(currCard.value)) {
            const cardToChange = document.getElementById(`${currentPlayer.name} 1`);
            cardToChange.className = `card ${currCard.suit}${currCard.value}`
            rightGuess('4', "4")
        }
        else {
            const cardToChange = document.getElementById(`${currentPlayer.name} 1`);
            cardToChange.className = `card ${currCard.suit}${currCard.value}`
            wrongGuess('4', "4")
        }
    }
    else {
        if (getCardValue(prevCard.value) > getCardValue(currCard.value)) {
            const cardToChange = document.getElementById(`${currentPlayer.name} 1`);
            cardToChange.className = `card ${currCard.suit}${currCard.value}`
            rightGuess('4', "4")
        }
        else {
            const cardToChange = document.getElementById(`${currentPlayer.name} 1`);
            cardToChange.className = `card ${currCard.suit}${currCard.value}`
            wrongGuess('4', '4')
        }
    }
    setTimeout(function() {
        currentPlayerIndex++;
        document.getElementById(`${currentPlayer.name}`).style.display = 'none';

        if (currentPlayerIndex < players.length) {
            nextMove('displayHigherLowerChoice()');
        }
        else {
            currentPlayerIndex = 0;
            nextMove('displayBetweenChoice()');
        }
    }, 6000);
}

function displayBetweenChoice() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup5').style.display = 'block';
}

function checkBetween(choice) {
    const currentPlayer = players[currentPlayerIndex];
    const bottomCard = currentPlayer.cards[0];
    const topCard = currentPlayer.cards[1];
    const currCard = currentPlayer.cards[2];
    
    
    
    
    setTimeout(function() {
        currentPlayerIndex++;
        document.getElementById(`${currentPlayer.name}`).style.display = 'none';
        if (currentPlayerIndex < players.length) {
            nextMove('displayBetweenChoice()');
        }
        else {
            currentPlayerIndex = 0;
            nextMove('');
        }
    }, 6000);
}