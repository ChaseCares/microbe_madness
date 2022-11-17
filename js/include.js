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
const FIRST_NAME = document.getElementById('first_name');
const LAST_NAME = document.getElementById('last_name');
const AM_BRACKET_INPUT = document.getElementById('am_bracket');
const PM_BRACKET_INPUT = document.getElementById('pm_bracket');
const OVERALL_WINNER = document.getElementById('overall_winner');
const CC_EMAIL_CONTAINER = document.getElementById('cc_email_container');
const CC_EMAIL = document.getElementById('cc_email');

const ENCODED_SEED = document.getElementById('encoded_seed');
const ENCODED_SEED_URL = document.getElementById('encoded_seed_url');
const RAW_SEED = document.getElementById('raw_seed');

const AM_BRACKET_TITLE = document.querySelector('.am');
const PM_BRACKET_TITLE = document.querySelector('.pm');
const GRID = document.querySelector('.grid');

const PREVIOUS_BRACKETS = document.getElementById('previous');
const PREVIOUS_BRACKETS_CONTAINER = document.querySelector('.previous-container');

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


//*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
//*** Reuse or modification is free provided you abide by the terms of that license.
//*** (Including the first two lines above in your source code satisfies the conditions.)

// Include this code (with notice above ;) in your library; read below for how to use it.

Date.prototype.customFormat = function(formatString){
	var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
	var dateObject = this;
	YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
	MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
	MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
	DD = (D=dateObject.getDate())<10?('0'+D):D;
	DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
	th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
	formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

	h=(hhh=dateObject.getHours());
	if (h==0) h=24;
	if (h>12) h-=12;
	hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
	AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
	mm=(m=dateObject.getMinutes())<10?('0'+m):m;
	ss=(s=dateObject.getSeconds())<10?('0'+s):s;
	return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};


function getDataFromURL() {
    const url = window.location.href;
    root_url = url.split('?')[0];
    try {
        if (url.includes('bracket')) {
            bracket = url.split('?')[1].split('&')[0].split('=')[1];
        }
        if (url.includes('seed')) {
            seed = atob(url.split('?')[1].split('&')[1].split('=')[1]).split(',').map(Number);
        }
    }
    catch(err) {
        console.log(err);
        setURL('am', 'MCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDA=');
    }
}


function setURL(bracket, seed) {
    history.replaceState({}, '', root_url + '?bracket=' + bracket + '&seed=' + btoa(seed));
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


function toggleBracket(value) {
    bracket = value;
    setBracket();
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


function checkForBracket(bracket) {
    if (localStorage.getItem(bracket)){
        return true;
    } else {
        return false;
    }
}


function checkForNumOfBracket(bracket) {
    for (let i = 0; i <= localStorage.length; i++) {
        if (!localStorage.getItem(`${bracket}-${i}`)) {
            return i;
        }
    }
}


function saveBracket() {
    if (!checkForBracket(bracket)) {
        localStorage.setItem(bracket, [FIRST_NAME.value, LAST_NAME.value, OVERALL_WINNER.value, btoa(seed), Date.now()]);
    } else {
        localStorage.setItem(`${bracket}-${checkForNumOfBracket(bracket)}`, [FIRST_NAME.value, LAST_NAME.value, OVERALL_WINNER.value, btoa(seed), Date.now()]);
    }
}

function addBracketsToPageHelper(bracket) {
    const data = localStorage.getItem(bracket).split(',');
    const fName = data[0];
    const lName = data[1];
    const displayBracket = bracket.split('-')[0].toUpperCase();
    let displayDate = 'No Date';

    if (data.length === 5) {
        const date = new Date(Number(data[4]));
        displayDate = date.customFormat("#DDD# #MMM# #DD# #YYYY# #hh#:#mm# #AMPM#");
    }

    PREVIOUS_BRACKETS.innerHTML += `<input type="button" value="Load ${fName} ${Array.from(lName)[0]}'s ${displayBracket} bracket, submitted on ${displayDate}" onclick="loadBracket('${bracket}')">`;
}


function loadBracket(LocBracket) {
    const LOC_BRACKET_DATA = localStorage.getItem(LocBracket).split(',');
    FIRST_NAME.value = LOC_BRACKET_DATA[0];
    OVERALL_WINNER.value = LOC_BRACKET_DATA[2];
    seed = atob(LOC_BRACKET_DATA[3]).split(',').map(Number);
    bracket = LocBracket.split('-')[0];
    setURL(bracket, seed);
    setBracket();
    setCombatants();
    addButtonCSS();
}

function addBracketsToPage() {
    let bracketFound = false;
    if (checkForBracket('am')) {
        addBracketsToPageHelper('am');
        for (let i = 0; i <= localStorage.length; i++) {
            if (localStorage.getItem(`am-${i}`)) {
                addBracketsToPageHelper(`am-${i}`);
            }
        }
        bracketFound = true;
    }
    if (checkForBracket('pm')) {
        addBracketsToPageHelper('pm');
        for (let i = 0; i <= localStorage.length; i++) {
            if (localStorage.getItem(`pm-${i}`)) {
                addBracketsToPageHelper(`pm-${i}`);
            }
        }
        bracketFound = true;
    }
    if (bracketFound) {
        PREVIOUS_BRACKETS_CONTAINER.classList.remove('hidden');
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
        saveBracket();
    } else {
        e.preventDefault();
    }
});

function init() {
    addBracketsToPage();
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


