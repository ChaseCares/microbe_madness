const bout_1 = document.querySelectorAll('.bout-1');
const bout_2 = document.querySelectorAll('.bout-2');
const bout_3 = document.querySelectorAll('.bout-3');
const bout_4 = document.querySelectorAll('.bout-4');
const bout_5 = document.querySelectorAll('.bout-5');
const bout_6 = document.querySelectorAll('.bout-6');
const bout_7 = document.querySelectorAll('.bout-7');
const bout_8 = document.querySelectorAll('.bout-8');
const bout_9 = document.querySelectorAll('.bout-9');
const bout_10 = document.querySelectorAll('.bout-10');
const bout_11 = document.querySelectorAll('.bout-11');
const bout_12 = document.querySelectorAll('.bout-12');
const bout_13 = document.querySelectorAll('.bout-13');
const bout_14 = document.querySelectorAll('.bout-14');
const bout_15 = document.querySelectorAll('.bout-15');
const winner = document.querySelector('.winner');

const position_1 = document.getElementById('position-1');
const position_2 = document.getElementById('position-2');
const position_3 = document.getElementById('position-3');
const position_4 = document.getElementById('position-4');
const position_5 = document.getElementById('position-5');
const position_6 = document.getElementById('position-6');
const position_7 = document.getElementById('position-7');
const position_8 = document.getElementById('position-8');
const position_9 = document.getElementById('position-9');
const position_10 = document.getElementById('position-10');
const position_11 = document.getElementById('position-11');
const position_12 = document.getElementById('position-12');
const position_13 = document.getElementById('position-13');
const position_14 = document.getElementById('position-14');


const am_bracket_title = document.querySelector('.am_bracket');
const pm_bracket_title = document.querySelector('.pm_bracket');
const grid = document.querySelector('.grid');

const am_bracket_input = document.getElementById('am_bracket');
const pm_bracket_input = document.getElementById('pm_bracket');


const combatants = ["",
    "Common Cold",
    "Aspergillus species",
    "Bacteroides fragilis",
    "Cryptococcus species",
    "Pseudomonas aeruginosa",
    "COVID",
    "Enterococcus faecalis",
    "Staphylococcus aureus",
    "E. coli",
    "Candida albicans",
    "Clostridioides difficile",
    "HIV",
    "Enterococcus faecium",
    "Streptococcus pneumoniae",
    "Streptococcus pyogenes",
    "Staphylococcus lugdunensis"];

function getDataFromURL() {
    const url = window.location.href;
    const root_url = url.split('?')[0];
    let seed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let bracket = 'am';

    if (url.includes('bracket')) {
        bracket = url.split('?')[1].split('&')[0].split('=')[1];
    }
    if (url.includes('seed')) {
        seed = atob(url.split('?')[1].split('&')[1].split('=')[1]).split(',').map(Number);
    }
    return [root_url, bracket, seed];

}


const data = getDataFromURL();
const root_url = data[0];
let bracket = data[1];
let seed = data[2];


function setURL(bracket, seed) {
    const url = root_url + '?bracket=' + bracket + '&seed=' + btoa(seed);
    window.history.pushState({}, '', url);
}

function setCombatants() {
    for (let i = 0; i < 15; i++) {
        document.getElementById(`position-${i}`).innerHTML = combatants[seed[i]];
    }
}


function setBracket() {
    if (bracket === 'am') {
        am_bracket_title.classList.remove('hidden');
        pm_bracket_title.classList.add('hidden');
        grid.classList.add('am');
        grid.classList.remove('pm');
        am_bracket_input.checked = true;
    } else {
        am_bracket_title.classList.add('hidden');
        pm_bracket_title.classList.remove('hidden');
        grid.classList.remove('am');
        grid.classList.add('pm');
        pm_bracket_input.checked = true;
    }
}

function addClickListeners(from, to, nextBoutPos, index) {
    from.forEach((bout) => {
        bout.addEventListener('click', () => {
            to[nextBoutPos].innerHTML = bout.innerHTML;
            seed[index] = combatants.indexOf(bout.innerHTML);
            verifyValidBracket();
            verifyValidBracket();
            verifyValidBracket();
            verifyValidBracket();
        });
    });
}

function addWinner(from, to, index) {
    from.forEach((bout) => {
        bout.addEventListener('click', () => {
            to.innerHTML = bout.innerHTML;
            seed[index] = combatants.indexOf(bout.innerHTML);
            verifyValidBracket();
        });
    });
}


function toggleBracket(bracket) {
    am_bracket_title.classList.toggle('hidden');
    pm_bracket_title.classList.toggle('hidden');
    grid.classList.toggle('am');
    grid.classList.toggle('pm');
    setURL(bracket, seed);
}

function verifyValidBracket() {
    let testSeed = [
    [seed[0], seed[1], seed[2], seed[3]], // [0]
    [seed[4], seed[5]],  // [1]
    [seed[6],
    seed[7],
    seed[8]],  // [2]
    [seed[9], seed[10]],   // [3]
    [seed[11], seed[12], seed[13], seed[14]]   // [4]
    ];

    if (!testSeed[0].includes(testSeed[1][0])) {
        position_4.innerHTML = '';
        seed[4] = 0;
    }
    if (!testSeed[0].includes(testSeed[1][1])) {
        position_5.innerHTML = '';
        seed[5] = 0;
    }

    if (!testSeed[1].includes(testSeed[2][0])) {
        position_6.innerHTML = '';
        seed[6] = 0;
    }

    if (testSeed[2][1] !== testSeed[2][0] && testSeed[2][1] !== testSeed[2][2] ) {
        position_7.innerHTML = '';
        seed[7] = 0;
    }

    if (!testSeed[3].includes(testSeed[2][2])) {
        position_8.innerHTML = '';
        seed[8] = 0;
    }

    if (!testSeed[4].includes(testSeed[3][0])) {
        position_9.innerHTML = '';
        seed[9] = 0;
    }
    if (!testSeed[4].includes(testSeed[3][1])) {
        position_10.innerHTML = '';
        seed[10] = 0;
    }
    setURL(bracket, seed);
}

function verifyBracketComplete() {
    if (seed.includes(0)) {
        console.log('bracket not complete');
    } else {
        console.log('bracket complete');
    }
    showIncomplete();
}

function showIncomplete() {
    let element = '';
    for (let i = 0; i < seed.length; i++) {
        element = document.getElementById(`position-${i}`)
        if (element.innerHTML === '') {
            element.classList.add('incomplete');
        } else {
            element.classList.remove('incomplete');
        }
    }
}

setBracket();
setCombatants();
verifyValidBracket();

addClickListeners(bout_1, bout_5, 0, 0);
addClickListeners(bout_2, bout_5, 1, 1);
addClickListeners(bout_3, bout_6, 0, 2);
addClickListeners(bout_4, bout_6, 1, 3);

addClickListeners(bout_5, bout_7, 0, 4);
addClickListeners(bout_6, bout_7, 1, 5);

addClickListeners(bout_7, bout_8, 0, 6);

addWinner(bout_8, winner, 7);

addClickListeners(bout_9, bout_8, 1, 8);

addClickListeners(bout_10, bout_9, 0, 9);
addClickListeners(bout_11, bout_9, 1, 10);

addClickListeners(bout_12, bout_10, 0, 11);
addClickListeners(bout_13, bout_10, 1, 12);
addClickListeners(bout_14, bout_11, 0, 13);
addClickListeners(bout_15, bout_11, 1, 14);


