const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');
const rankingBtn = document.querySelector('.ranking')
const helpBtn = document.querySelector('.help')
const closeBtn = document.querySelector('.close-button')
const modal = document.querySelector('.modal')
const winnerModal = document.querySelector('.winner-modal')
const saveScoreBtn = document.querySelector('.save-score-btn')

const words =
    'Abuse,Adult,Agent,Anger,Apple,Award,Basis,Beach,Birth,Block,Blood,Board,Brain,Bread,Break,Brown,Buyer,Cause,Chain,Chair,Chest,Chief,Child,China,Claim,Class,Clock,Coach,Coast,Court,Cover,Cream,Crime,Cross,Crowd,Crown,Cycle,Dance,Death,Depth,Doubt,Draft,Drama,Dream,Dress,Drink,Drive,Earth,Enemy,Entry,Error,Event,Faith,Fault,Field,Fight,Final,Floor,Focus,Force,Frame,Frank,Front,Fruit,Glass,Grant,Grass,Green,Group,Guide,Heart,Henry,Horse,Hotel,House,Image,Index,Input,Issue,Japan,Jones,Judge,Knife,Laura,Layer,Level,Lewis,Light,Limit,Lunch,Major,March,Match,Metal,Model,Money,Month,Motor,Mouth,Music,Night,Noise,North,Novel,Nurse,Offer,Order,Other,Owner,Panel,Paper,Party,Peace,Peter,Phase,Phone,Piece,Pilot,Pitch,Place,Plane,Plant,Plate,Point,Pound,Power,Press,Price,Pride,Prize,Proof,Queen,Radio,Range,Ratio,Reply,Right,River,Round,Route,Rugby,Scale,Scene,Scope,Score,Sense,Shape,Share,Sheep,Sheet,Shift,Shirt,Shock,Sight,Simon,Skill,Sleep,Smile,Smith,Smoke,Sound,South,Space,Speed,Spite,Sport,Squad,Staff,Stage,Start,State,Steam,Steel,Stock,Stone,Store,Study,Stuff,Style,Sugar,Table,Taste,Terry,Theme,Thing,Title,Total,Touch,Tower,Track,Trade,Train,Trend,Trial,Trust,Truth,Uncle,Union,Unity,Value,Video,Visit,Voice,Waste,Watch,Water,While,White,Whole,Woman,World,Youth'
        .split(',')
        .map((word) => word.toUpperCase(word));

const word = words[Math.floor(Math.random() * words.length)];

console.log('Hint: ' + word);

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<',
];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
];

let isGameOver = false;
let currentRow = 0;
let currentColumn = 0;

guessRows.forEach((guessRow, rowIdx) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'row-' + rowIdx);
    guessRow.forEach((_, columnIdx) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'row-' + rowIdx + '-col-' + columnIdx);
        tileElement.setAttribute('class', 'tile');
        rowElement.append(tileElement);
        rowElement.appendChild(tileElement);
    });
    tileDisplay.appendChild(rowElement);
});

function handleClick(e) {
    if (isGameOver) return;
    if (!(e.target.tagName === 'BUTTON')) return;
    const key = e.target.innerText;
    window.navigator.vibrate(50);
    if (key === '<') {
        deleteLetter();
    } else if (key === 'ENTER') {
        checkRow();
    } else {
        addLetter(key);
    }
}

const addLetter = (letter) => {
    if (currentColumn === 5) return;
    const tile = document.getElementById(
        `row-${currentRow}-col-${currentColumn}`
    );
    tile.textContent = letter;
    tile.setAttribute('data', letter);
    guessRows[currentRow][currentColumn] = letter;
    currentColumn++;
};

const deleteLetter = () => {
    currentColumn--;
    if (currentColumn < 0) {
        currentColumn = 0;
    }
    const tile = document.getElementById(
        `row-${currentRow}-col-${currentColumn}`
    );
    tile.textContent = '';
    tile.setAttribute('data', '');
    guessRows[currentRow][currentColumn] = '';
};

function showWinnerModal(score) {
    winnerModal.classList.add('open')
    const scoreSpan = winnerModal.querySelector('span')
    scoreSpan.textContent = +score
}

function checkRow() {
    if (currentColumn > 4) {
        flipColumns();
        const guess = guessRows[currentRow].join('');
        if (guess.toUpperCase() === word) {
            isGameOver = true;
            showMessage('Magnicicent!');
            showWinnerModal(100 - currentRow * 10)
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                showMessage(word);
            } else {
                currentRow++;
                currentColumn = 0;
            }
        }
    }
}

function showMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

function flipColumns() {
    const row = document.getElementById('row-' + currentRow);
    let wordle = word;
    let guess = [];
    const rowCols = Array.from(row.children);

    rowCols.forEach((col, idx) => {
        guess.push({ letter: col.getAttribute('data'), color: 'grey-overlay' });
    });

    guess.forEach((guess, idx) => {
        if (guess.letter === wordle[idx]) {
            guess.color = 'green-overlay';
            wordle = wordle.replace(guess.letter, '*');
        }
    });

    guess.forEach((guess, idx) => {
        if (wordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            wordle = wordle.replace(guess.letter, '*');
        }
    });

    rowCols.forEach((col, i) => {
        setTimeout(() => {
            col.classList.add('flip');
            col.classList.add(guess[i].color);
            addColorToKey(guess[i].letter, guess[i].color);
        }, 500 * i);
    });
}

function addColorToKey(key, className) {
    document
        .querySelector('button[data-key="' + key.toUpperCase() + '"]')
        .classList.add(className);
}

function hasInStore(key) {
    const data = localStorage.getItem(key)
    if (data) return true
    return false
}

function addScore() {
    if (!hasInStore('score')) {
        localStorage.setItem('score', JSON.stringify([]))
    }
    const scoreArray = JSON.parse(localStorage.getItem('score'))
    const nameInput = document.querySelector('input')
    const name = nameInput.value
    const score = +document.querySelector('.score').textContent
    scoreArray.push({ score, name })
    localStorage.setItem('score', JSON.stringify(scoreArray.slice(0, 10)))
}

keys.forEach((key) => {
    const buttonElement = document.createElement('button');
    buttonElement.innerText = key;
    buttonElement.setAttribute('data-key', key);
    keyboard.appendChild(buttonElement);
});

keyboard.addEventListener('click', handleClick);

window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();

    if (isGameOver) return;
    if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key === 'ENTER') {
        checkRow();
    } else {
        if (!keys.includes(key)) return;
        addLetter(key);
    }
});

helpBtn.addEventListener('click', () => {
    modal.classList.add('open')
    const content = modal.querySelector('.content')
    content.innerHTML = ''
    const template = document.querySelector('#how-to-play')
    const clone = template.content.cloneNode(true);
    content.appendChild(clone)
})

rankingBtn.addEventListener('click', () => {
    modal.classList.add('open')
    const content = modal.querySelector('.content')
    content.innerHTML = ''
    const template = document.querySelector('#ranking-template')
    const clone = template.content.cloneNode(true)
    content.appendChild(clone)
    if (hasInStore('score')) {
        const table = content.querySelector('table')
        const score = JSON.parse(localStorage.getItem('score'))
        score.sort((a, b) => b.score - a.score)
        score.forEach(({ name, score }, idx) => {
            const row = document.createElement('tr')
            const placeColumn = document.createElement('td')
            const nameColumn = document.createElement('td')
            const scoreColumn = document.createElement('td')
            placeColumn.textContent = idx + 1
            nameColumn.textContent = name
            scoreColumn.textContent = score
            row.append(placeColumn, nameColumn, scoreColumn)
            table.appendChild(row)
        })

    }
})

closeBtn.addEventListener('click', () => {
    modal.classList.remove('open')
})

saveScoreBtn.addEventListener('click', () => {
    addScore()
    winnerModal.classList.remove('open')
})