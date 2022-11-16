const BOUT_1 = document.querySelectorAll('.bout-1');
const BOUT_2 = document.querySelectorAll('.bout-2');
const BOUT_3 = document.querySelectorAll('.bout-3');
const BOUT_4 = document.querySelectorAll('.bout-4');
const BOUT_5 = document.querySelectorAll('.bout-5');
const BOUT_6 = document.querySelectorAll('.bout-6');
const BOUT_7 = document.querySelectorAll('.bout-7');
const BOUT_8 = document.querySelectorAll('.bout-8');
const BOUT_9 = document.querySelectorAll('.bout-9');
const BOUT_10 = document.querySelectorAll('.bout-10');
const BOUT_11 = document.querySelectorAll('.bout-11');
const BOUT_12 = document.querySelectorAll('.bout-12');
const BOUT_13 = document.querySelectorAll('.bout-13');
const BOUT_14 = document.querySelectorAll('.bout-14');
const BOUT_15 = document.querySelectorAll('.bout-15');
const WINNER = document.querySelector('.winner');

const POSITION_4 = document.getElementById('position-4');
const POSITION_5 = document.getElementById('position-5');
const POSITION_6 = document.getElementById('position-6');
const POSITION_7 = document.getElementById('position-7');
const POSITION_8 = document.getElementById('position-8');
const POSITION_9 = document.getElementById('position-9');
const POSITION_10 = document.getElementById('position-10');

const BRACKET_FORM = document.getElementById('bracketForm');
const AM_BRACKET_INPUT = document.getElementById('am_bracket');
const PM_BRACKET_INPUT = document.getElementById('pm_bracket');
const CC_EMAIL_CONTAINER = document.getElementById('cc_email_container');
const CC_EMAIL = document.getElementById('cc_email');
const ENCODED_SEED = document.getElementById('encoded_seed');
const ENCODED_SEED_URL = document.getElementById('encoded_seed_url');
const RAW_SEED = document.getElementById('raw_seed');

const AM_BRACKET_TITLE = document.querySelector('.am-bracket');
const PM_BRACKET_TITLE = document.querySelector('.pm-bracket');
const GRID = document.querySelector('.grid');

const COMBATANTS = ["",
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

var root_url;
var bracket = 'am';
var seed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


function getDataFromURL() {
    const url = window.location.href;
    root_url = url.split('?')[0];

    if (url.includes('bracket')) {
        bracket = url.split('?')[1].split('&')[0].split('=')[1];
    }
    if (url.includes('seed')) {
        seed = atob(url.split('?')[1].split('&')[1].split('=')[1]).split(',').map(Number);
    }
}


function setURL(bracket, seed) {
    window.history.pushState({}, '', root_url + '?bracket=' + bracket + '&seed=' + btoa(seed));
}


function setCombatants() {
    for (let i = 0; i < 15; i++) {
        document.getElementById(`position-${i}`).innerHTML = COMBATANTS[seed[i]];
    }
}

function addButtonCSS() {
    let element;
    for (let i = 0; i < 15; i++) {
        element = document.getElementById(`position-${i}`);
        if (element.innerHTML === '') {
            element.classList.add('empty');
            element.classList.remove('grid-item-button');
        } else {
            element.classList.add('grid-item-button');
            element.classList.remove('empty');
        }
    }
}

function setBracket() {
    if (bracket === 'am') {
        AM_BRACKET_TITLE.classList.remove('hidden');
        PM_BRACKET_TITLE.classList.add('hidden');
        GRID.classList.add('am');
        GRID.classList.remove('pm');
        AM_BRACKET_INPUT.checked = true;
    } else {
        AM_BRACKET_TITLE.classList.add('hidden');
        PM_BRACKET_TITLE.classList.remove('hidden');
        GRID.classList.remove('am');
        GRID.classList.add('pm');
        PM_BRACKET_INPUT.checked = true;
    }
}


function addClickListeners(from, to, nextBoutPos, index) {
    from.forEach((bout) => {
        bout.addEventListener('click', () => {
            to[nextBoutPos].innerHTML = bout.innerHTML;
            // to[nextBoutPos].classList.toggle('grid-item-button');
            seed[index] = COMBATANTS.indexOf(bout.innerHTML);

            verifyValidBracket();
            verifyValidBracket();
            verifyValidBracket();
            verifyValidBracket();
            addButtonCSS();
        });
    });
}


function addWinner(from, to, index) {
    from.forEach((bout) => {
        bout.addEventListener('click', () => {
            to.innerHTML = bout.innerHTML;
            seed[index] = COMBATANTS.indexOf(bout.innerHTML);
            verifyValidBracket();
        });
    });
}


function toggleBracket(bracket) {
    AM_BRACKET_TITLE.classList.toggle('hidden');
    PM_BRACKET_TITLE.classList.toggle('hidden');
    GRID.classList.toggle('am');
    GRID.classList.toggle('pm');
    setURL(bracket, seed);
}


function verifyValidBracket() {
    let testSeed = [
    [seed[0], seed[1], seed[2], seed[3]],
    [seed[4], seed[5]],
    [seed[6],
    seed[7],
    seed[8]],
    [seed[9], seed[10]],
    [seed[11], seed[12], seed[13], seed[14]]];

    if (!testSeed[0].includes(testSeed[1][0])) {
        POSITION_4.innerHTML = '';
        seed[4] = 0;
    }
    if (!testSeed[0].includes(testSeed[1][1])) {
        POSITION_5.innerHTML = '';
        seed[5] = 0;
    }

    if (!testSeed[1].includes(testSeed[2][0])) {
        POSITION_6.innerHTML = '';
        seed[6] = 0;
    }

    if (testSeed[2][1] !== testSeed[2][0] && testSeed[2][1] !== testSeed[2][2] ) {
        POSITION_7.innerHTML = '';
        seed[7] = 0;
    }

    if (!testSeed[3].includes(testSeed[2][2])) {
        POSITION_8.innerHTML = '';
        seed[8] = 0;
    }

    if (!testSeed[4].includes(testSeed[3][0])) {
        POSITION_9.innerHTML = '';
        seed[9] = 0;
    }
    if (!testSeed[4].includes(testSeed[3][1])) {
        POSITION_10.innerHTML = '';
        seed[10] = 0;
    }
    setURL(bracket, seed);
    showIncomplete(true);
    addButtonCSS();
}


function verifyBracketComplete() {
    if (seed.includes(0)) {
        showIncomplete();
        return false;
    } else {
        return true;
    }
}


function showIncomplete(onlyRemove=false) {
    let element;
    for (let i = 0; i < seed.length; i++) {
        element = document.getElementById(`position-${i}`);
        if (element.innerHTML === '') {
            if (!onlyRemove) {
                element.classList.add('incomplete');
            }
        } else {
            element.classList.remove('incomplete');
        }
    }
}


BRACKET_FORM.addEventListener('submit', (e) => {
    if (verifyBracketComplete()) {
        ENCODED_SEED.value = btoa(seed);
        ENCODED_SEED_URL.value = window.location.href;
        RAW_SEED.value = seed;
        if (CC_EMAIL.value == '') {
            CC_EMAIL_CONTAINER.innerHTML = '';
        }
    } else {
        e.preventDefault();
        console.log('bracket not complete');
    }
});

function init() {
    getDataFromURL();
    setBracket();
    setCombatants();
    verifyValidBracket();
    addButtonCSS();

    addClickListeners(BOUT_1, BOUT_5, 0, 0);
    addClickListeners(BOUT_2, BOUT_5, 1, 1);
    addClickListeners(BOUT_3, BOUT_6, 0, 2);
    addClickListeners(BOUT_4, BOUT_6, 1, 3);

    addClickListeners(BOUT_5, BOUT_7, 0, 4);
    addClickListeners(BOUT_6, BOUT_7, 1, 5);

    addClickListeners(BOUT_7, BOUT_8, 0, 6);

    addWinner(BOUT_8, WINNER, 7);

    addClickListeners(BOUT_9, BOUT_8, 1, 8);

    addClickListeners(BOUT_10, BOUT_9, 0, 9);
    addClickListeners(BOUT_11, BOUT_9, 1, 10);

    addClickListeners(BOUT_12, BOUT_10, 0, 11);
    addClickListeners(BOUT_13, BOUT_10, 1, 12);
    addClickListeners(BOUT_14, BOUT_11, 0, 13);
    addClickListeners(BOUT_15, BOUT_11, 1, 14);
}

init();
