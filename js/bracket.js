const SVG_NS = 'http://www.w3.org/2000/svg';

const FIRST_NAME = document.getElementById('first_name');
const LAST_NAME = document.getElementById('last_name');
const FULL_URL = document.getElementById('full_url');
const BRACKET_FORM = document.getElementById('bracketForm');
const SUBMIT_BUTTON = document.getElementById('submit_button');
const USER_FEEDBACK = document.getElementById('user_feedback');
const THINKING_CONTAINER = document.getElementById('thinking_container');

const ENCODED_SEED = document.getElementById('encoded_seed');

const COLORS = {
	line: 'black',
	fill: 'white',
	winner: 'green',
	loser: 'red',
	neutral: 'gray',
};

const DIMENSIONS = {
	window: { width: 1950, height: 750, titleHeight: 50 },
	nameBox: { height: 50, width: 200, textOffset: 30, flagOffset: 15 },
	offsets: { vertical: 100, horizontal: 250, padding: 50 },
};

const BRACKET_VIEWBOX = `0 0 ${DIMENSIONS.window.width + DIMENSIONS.offsets.padding * 2} ${
	DIMENSIONS.window.height + DIMENSIONS.offsets.padding * 2 + DIMENSIONS.window.titleHeight
}`;

const results = {
	participants: {
		left: [
			'5 Kleb aerogenes',
			'8 MRSA',
			'10 Candida albicans',
			'6 RSV',
			'4 ESBL E. coli',
			'7 C diff',
			'13 Strep pyogenes',
			'12 Strep pneumo',
		],
		right: [
			'1 VRE',
			'3 CRE',
			'16 HIV',
			'11 Staph lugdunensis',
			'9 MSSA',
			'2 Pseudomonas',
			'15 Syphilis',
			'14 Rickettsia',
		],
	},
	rounds: {
		left: [],
		right: [],
	},
};

let board = {
	year: 2024,
	version: 2,
	left_1: {
		0: null,
		1: null,
		2: null,
		3: null,
	},
	left_2: {
		0: null,
		1: null,
	},
	left_3: {
		0: null,
	},
	right_1: {
		0: null,
		1: null,
		2: null,
		3: null,
	},
	right_2: {
		0: null,
		1: null,
	},
	right_3: {
		0: null,
	},
	overall_winner: null,
};

if (getURL()) {
	board = decodeBoard(getURL());
}

const url = window.location.href;
root_url = url.split('?')[0];

const activeLinks = !url.includes('create.html');

initializeRounds(results.participants.left, results.rounds.left);
initializeRounds(results.participants.right, results.rounds.right);

const bracketWindow = document.createElementNS(SVG_NS, 'svg');
bracketWindow.setAttribute('id', 'map');
bracketWindow.setAttribute('viewBox', BRACKET_VIEWBOX);
bracketWindow.setAttribute('xmlns', SVG_NS);
bracketWindow.setAttribute('preserveAspectRatio', 'xMinYMin');
document.getElementById('bracket').appendChild(bracketWindow);

const defs = createGradientBackground('#c5fcbe', '#a0c1ff', 310);
bracketWindow.appendChild(defs);

const windowBackground = createRect(
	0,
	0,
	DIMENSIONS.window.height + DIMENSIONS.offsets.padding * 2 + DIMENSIONS.window.titleHeight,
	DIMENSIONS.window.width + DIMENSIONS.offsets.padding * 2,
	'url(#grad1)',
	40
);
bracketWindow.appendChild(windowBackground);

const title = createTitle();
bracketWindow.appendChild(title);

const bracket = document.createElementNS(SVG_NS, 'g');
bracket.setAttribute('id', 'bracket');
bracketWindow.appendChild(bracket);

createBracketSide(DIMENSIONS.offsets.padding, results.rounds.left);
createBracketSide(
	DIMENSIONS.offsets.padding + DIMENSIONS.window.width - 200,
	results.rounds.right,
	true
);

const winnerBox = createWinnerBox(
	DIMENSIONS.window.width / 2 - DIMENSIONS.nameBox.width / 2,
	DIMENSIONS.window.height / 2 + DIMENSIONS.nameBox.height * 2
);
bracket.appendChild(winnerBox);

fillBoard();

function fillBoard() {
	const sections = ['left_1', 'left_2', 'left_3', 'right_1', 'right_2', 'right_3'];

	for (const section of sections) {
		for (const [index, match] of Object.entries(board[section])) {
			if (match !== null) {
				document.getElementById(`${section}_${index}`).textContent = match;
			}
		}
	}

	if (board.overall_winner !== null) {
		document.getElementById('overall_winner').textContent = board.overall_winner.replace(
			/^\d+\s/,
			''
		);
	}
}

function showIncomplete() {
	const sections = [
		board.left_1,
		board.left_2,
		board.left_3,
		board.right_1,
		board.right_2,
		board.right_3,
	];

	for (const section of sections) {
		for (const match of Object.values(section)) {
			if (match === null) {
				return true;
			}
		}
	}

	return board.overall_winner === null;
}

function checkForBracket(bracket) {
	if (localStorage.getItem(bracket)) {
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

function saveBracket(encodedBoard) {
	const bracket = 'bracket';
	if (!checkForBracket(`${bracket}-0`)) {
		localStorage.setItem(`${bracket}-0`, [
			FIRST_NAME.value,
			LAST_NAME.value,
			Date.now(),
			encodedBoard,
		]);
	} else {
		localStorage.setItem(`${bracket}-${checkForNumOfBracket(bracket)}`, [
			FIRST_NAME.value,
			LAST_NAME.value,
			Date.now(),
			encodedBoard,
		]);
	}
}

function verifyBracketComplete() {
	if (showIncomplete()) {
		alert('Please complete your bracket before submitting.');
		return false;
	}
	return true;
}

function sendUserFeedback(element) {
	SUBMIT_BUTTON.classList.add('hidden');
	USER_FEEDBACK.classList.remove('hidden');

	let thinking_boi = setInterval(() => {
		element.innerHTML += '🤔';
	}, 1000);

	setTimeout(() => {
		clearInterval(thinking_boi);
		USER_FEEDBACK.classList.add('hidden');
		element.innerHTML = 'Something may have gone wrong. Please wait a moment and try again.';
	}, 60000);
}

if (!activeLinks) {
	BRACKET_FORM.addEventListener('submit', (e) => {
		if (verifyBracketComplete()) {
			ENCODED_SEED.value = encodeBoard(board);
			FULL_URL.value = `${root_url}?bracket=${ENCODED_SEED.value}`;
			saveBracket(ENCODED_SEED.value);
			sendUserFeedback(THINKING_CONTAINER);
		} else {
			e.preventDefault();
		}
	});
}

function initializeRounds(participants, roundsArray) {
	let currentRound = participants.map((name) => ({ name }));
	while (currentRound.length > 1) {
		roundsArray.push(currentRound);
		currentRound = Array.from({ length: currentRound.length / 2 }, () => ({
			name: null,
		}));
	}
	roundsArray.push(currentRound);
}

function createBracketSide(offsetX, roundsArray, isMirrored = false) {
	const connections = [];
	roundsArray.forEach((round, roundIndex) => {
		round.forEach((match, matchIndex) => {
			const x = offsetX + (isMirrored ? -1 : 1) * roundIndex * DIMENSIONS.offsets.horizontal;
			match.y = getMatchY(roundsArray, roundIndex, matchIndex);

			const side = isMirrored ? 'right' : 'left';

			const nameBox = createNameBox(
				x,
				match.y,
				match.name,
				null,
				isMirrored,
				`handleNameBoxClick(${roundIndex}, ${matchIndex}, ${isMirrored})`,
				`${side}_${roundIndex}_${matchIndex}`
			);
			bracket.appendChild(nameBox);

			if (roundIndex > 0) {
				const end = { x, y: match.y + DIMENSIONS.nameBox.height / 2 };
				const prevRound = roundsArray[roundIndex - 1];
				[0, 1].forEach((i) => {
					const start = {
						x:
							offsetX +
							(isMirrored ? -1 : 1) * (roundIndex - 1) * DIMENSIONS.offsets.horizontal +
							DIMENSIONS.nameBox.width,
						y: prevRound[matchIndex * 2 + i].y + DIMENSIONS.nameBox.height / 2,
					};
					connections.push({ start, end });
				});
			}
		});
	});

	connections.forEach(({ start, end }) =>
		bracket.appendChild(createConnection(start, end, COLORS.line, isMirrored))
	);
}

function createTitle() {
	let title;
	if (activeLinks) {
		title = createText(
			DIMENSIONS.window.width / 2 + DIMENSIONS.offsets.padding,
			DIMENSIONS.window.titleHeight / 2 + 30,
			'2024 Tournament Results!',
			false,
			false,
			null,
			'middle',
			40,
			'bold'
		);
	} else {
		title = createText(
			DIMENSIONS.window.width / 2 + DIMENSIONS.offsets.padding,
			DIMENSIONS.window.titleHeight / 2 + 30,
			'Your 2024 Bracket!',
			false,
			false,
			null,
			'middle',
			40,
			'bold'
		);
	}
	return title;
}

function getMatchY(roundsArray, roundIndex, matchIndex) {
	return roundIndex === 0
		? matchIndex * DIMENSIONS.offsets.vertical +
				DIMENSIONS.nameBox.height +
				DIMENSIONS.window.titleHeight
		: (roundsArray[roundIndex - 1][matchIndex * 2].y +
				roundsArray[roundIndex - 1][matchIndex * 2 + 1].y) /
				2;
}

function encodeBoard(board) {
	const boardString = JSON.stringify(board);
	const boardBase64 = btoa(boardString);
	return boardBase64;
}

function decodeBoard(boardBase64) {
	const boardString = atob(boardBase64);
	const board = JSON.parse(boardString);
	return board;
}

function setURL() {
	const boardBase64 = encodeBoard(board);
	const bracketURL = `${root_url}?bracket=${boardBase64}`;
	window.history.pushState({ path: bracketURL }, '', bracketURL);
}

function getURL() {
	const urlParams = new URLSearchParams(window.location.search);
	if (!urlParams.has('bracket')) {
		return null;
	}

	const bracketBase64 = urlParams.get('bracket');
	return bracketBase64;
}

function boardUpdate() {
	setURL();
}

function handleNameBoxClick(roundIndex, matchIndex, isMirrored = false) {
	if (activeLinks) {
		return;
	}

	const side = isMirrored ? 'right' : 'left';
	const targetRound = roundIndex + 1;
	const targetMatch = Math.floor(matchIndex / 2);
	const currentText = document.getElementById(`${side}_${roundIndex}_${matchIndex}`).textContent;

	let targetMatchIndex = targetMatch;
	for (let i = roundIndex + 1; i < 5; i++) {
		if (i === 4) {
			document.getElementById('overall_winner').textContent = null;
			board.overall_winner = null;
			break;
		}
		board[`${side}_${i}`][targetMatchIndex] = null;
		document.getElementById(`${side}_${i}_${targetMatchIndex}`).textContent = null;
		targetMatchIndex = Math.floor(targetMatchIndex / 2);
	}

	if (targetRound != 4) {
		board[`${side}_${targetRound}`][targetMatch] = currentText;
		document.getElementById(`${side}_${targetRound}_${targetMatch}`).textContent = currentText;
	} else {
		board.overall_winner = currentText;
		document.getElementById('overall_winner').textContent = currentText.replace(/^\d+\s/, '');
	}

	boardUpdate();
}

function createNameBox(x, y, name, winner, isMirrored = false, onClick = null, id = null) {
	const nameBox = document.createElementNS(SVG_NS, 'g');
	nameBox.setAttribute('id', `g_${id}`);

	if (onClick) {
		nameBox.setAttribute('onclick', onClick);
	}

	nameBox.appendChild(
		createRect(
			x,
			y,
			DIMENSIONS.nameBox.height,
			DIMENSIONS.nameBox.width,
			COLORS.fill,
			0,
			'lightgray',
			id
		)
	);

	const flagColor =
		winner === true ? COLORS.winner : winner === false ? COLORS.loser : COLORS.neutral;
	const flagX = isMirrored ? x + DIMENSIONS.nameBox.width - DIMENSIONS.nameBox.flagOffset : x;
	nameBox.appendChild(
		createRect(
			flagX,
			y,
			DIMENSIONS.nameBox.height,
			DIMENSIONS.nameBox.flagOffset,
			flagColor,
			0,
			'gray',
			id
		)
	);

	const textX = isMirrored
		? x + DIMENSIONS.nameBox.width - DIMENSIONS.nameBox.textOffset + 10
		: x + DIMENSIONS.nameBox.textOffset - 10;

	let url_name;
	if (name) {
		url_name = name.replace(/^\d+\s/, '');
	}

	if (activeLinks) {
		nameBox.appendChild(
			createLink(textX, y + DIMENSIONS.nameBox.textOffset, name, `#${url_name}`, isMirrored)
		);
	} else {
		nameBox.appendChild(
			createText(textX, y + DIMENSIONS.nameBox.textOffset, name, isMirrored, false, id)
		);
	}

	return nameBox;
}

function createLink(x, y, text, href, isMirrored, target = '_self') {
	const link = document.createElementNS(SVG_NS, 'a');
	link.setAttribute('href', href.replace(/ /g, '_').replace('.', ''));
	link.setAttribute('target', target);
	link.setAttribute('fill', 'blue');
	link.appendChild(createText(x, y, text, isMirrored, true));

	return link;
}

function createText(
	x,
	y,
	text,
	isMirrored,
	link = false,
	id = null,
	anchor = null,
	fontSize = 18,
	fontWeight = 'normal'
) {
	let textAnchor;

	if (anchor) {
		textAnchor = anchor;
	} else {
		textAnchor = isMirrored ? 'end' : 'start';
	}

	const textElement = document.createElementNS(SVG_NS, 'text');

	if (link) {
		textElement.setAttribute('style', 'text-decoration: underline; cursor: pointer;');
	}

	if (id) {
		textElement.setAttribute('id', id);
	}

	textElement.setAttribute('x', x);
	textElement.setAttribute('y', y);
	textElement.setAttribute('text-anchor', textAnchor);
	textElement.setAttribute('font-size', fontSize);
	textElement.setAttribute('font-weight', fontWeight);
	textElement.textContent = text;

	return textElement;
}

function createRect(x, y, height, width, fill, radius = 0, mouseoverFill = false, id = null) {
	const rect = document.createElementNS(SVG_NS, 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('height', height);
	rect.setAttribute('width', width);

	if (mouseoverFill && !activeLinks) {
		rect.addEventListener('mouseenter', () => {
			const correspondingTaxt = document.getElementById(id);
			if (correspondingTaxt.textContent === '') {
				return;
			}

			const group = document.getElementById(`g_${id}`);
			group.classList.add('hovered');

			correspondingTaxt.addEventListener('mouseenter', () => {
				group.classList.add('hovered');
			});
		});

		rect.addEventListener('mouseleave', () => {
			const group = document.getElementById(`g_${id}`);
			group.classList.remove('hovered');
		});
	}
	rect.setAttribute('fill', fill);
	rect.setAttribute('stroke', COLORS.line);
	rect.setAttribute('rx', radius);
	rect.setAttribute('ry', radius);
	return rect;
}

function createConnection(start, end, strokeColor = COLORS.line, isMirrored = false) {
	const adjustedStartX = isMirrored ? start.x - DIMENSIONS.nameBox.width : start.x;
	const adjustedEndX = isMirrored ? end.x + DIMENSIONS.nameBox.width + 67 : end.x;

	const dx = ((adjustedEndX - adjustedStartX) / 2) * (isMirrored ? -1 : 1);
	const dy = end.y - start.y;
	const radiusX = Math.min(15, Math.abs(dx)) * (isMirrored ? -1 : 1);
	const radiusY = Math.min(15, Math.abs(dy) / 2) * Math.sign(dy);

	const pathData = `
        M ${adjustedStartX} ${start.y}
        h ${dx - Math.abs(radiusX)}
        q ${radiusX} 0 ${radiusX} ${radiusY}
        V ${end.y - radiusY}
        q 0 ${radiusY} ${radiusX} ${radiusY}
        h ${dx - Math.abs(radiusX)}`.trim();

	const path = document.createElementNS(SVG_NS, 'path');
	path.setAttribute('d', pathData);
	path.setAttribute('fill', 'none');
	path.setAttribute('stroke', strokeColor);
	path.setAttribute('stroke-width', 2);
	return path;
}

function createWinnerBox() {
	const oversizeWith = 100;
	const oversizeHeight = 10;

	const centerX =
		DIMENSIONS.window.width / 2 - DIMENSIONS.nameBox.width / 2 + DIMENSIONS.offsets.padding;
	const centerY =
		DIMENSIONS.window.height / 2 -
		DIMENSIONS.nameBox.height / 2 +
		DIMENSIONS.offsets.padding +
		DIMENSIONS.window.titleHeight;

	const offsetY = 145;

	const winnerBox = document.createElementNS(SVG_NS, 'g');
	winnerBox.appendChild(
		createRect(
			centerX - oversizeWith / 2,
			centerY - oversizeHeight / 2 + offsetY,
			DIMENSIONS.nameBox.height + oversizeHeight,
			DIMENSIONS.nameBox.width + oversizeWith,
			COLORS.fill
		)
	);

	const winnerText = createText(
		centerX + DIMENSIONS.nameBox.width / 2,
		centerY + DIMENSIONS.nameBox.height / 2 + offsetY + 8,
		null,
		false,
		false,
		'overall_winner',
		'middle',
		25
	);
	winnerBox.appendChild(winnerText);

	const winnerTitle = createText(
		centerX + DIMENSIONS.nameBox.width / 2,
		centerY - DIMENSIONS.nameBox.height / 2 + offsetY + 5,
		'🏆 Overall Winner 🏆',
		false,
		false,
		null,
		'middle',
		25,
		'bold'
	);
	winnerBox.appendChild(winnerTitle);

	return winnerBox;
}

function createGradientBackground(color1, color2, angle) {
	const defs = document.createElementNS(SVG_NS, 'defs');
	const linearGradient = document.createElementNS(SVG_NS, 'linearGradient');
	linearGradient.setAttribute('id', 'grad1');

	const x1 = Math.round(50 + 50 * Math.cos(((angle - 90) * Math.PI) / 180));
	const y1 = Math.round(50 + 50 * Math.sin(((angle - 90) * Math.PI) / 180));
	const x2 = Math.round(50 + 50 * Math.cos(((angle + 90) * Math.PI) / 180));
	const y2 = Math.round(50 + 50 * Math.sin(((angle + 90) * Math.PI) / 180));

	linearGradient.setAttribute('x1', `${x1}%`);
	linearGradient.setAttribute('y1', `${y1}%`);
	linearGradient.setAttribute('x2', `${x2}%`);
	linearGradient.setAttribute('y2', `${y2}%`);

	const stop1 = document.createElementNS(SVG_NS, 'stop');
	stop1.setAttribute('offset', '0%');
	stop1.setAttribute('style', `stop-color:${color1};stop-opacity:1`);

	const stop2 = document.createElementNS(SVG_NS, 'stop');
	stop2.setAttribute('offset', '100%');
	stop2.setAttribute('style', `stop-color:${color2};stop-opacity:1`);

	linearGradient.appendChild(stop1);
	linearGradient.appendChild(stop2);
	defs.appendChild(linearGradient);

	return defs;
}

function addTextToNameBox(nameBoxID, text) {
	const nameBox = document.getElementById(nameBoxID);
	nameBox.removeChild(nameBox.childNodes[2]);

	const nameBox_x = nameBox.childNodes[0].getAttribute('x');
	const nameBox_y = nameBox.childNodes[0].getAttribute('y');

	const textElement = createText(
		parseInt(nameBox_x) + DIMENSIONS.nameBox.textOffset,
		parseInt(nameBox_y) + DIMENSIONS.nameBox.textOffset,
		text,
		false,
		false,
		null,
		'start',
		18,
		'normal'
	);
	nameBox.appendChild(textElement);
}

function markOutcome(nameBoxID, outcome = 'winner') {
	const nameBox = document.getElementById(nameBoxID);

	if (outcome === 'loser') {
		nameBox.childNodes[1].setAttribute('fill', COLORS.loser);

		return;
	}
	nameBox.childNodes[1].setAttribute('fill', COLORS.winner);
}

// updates TODO: Make this much better
// Round one
markOutcome('g_left_0_0');
markOutcome('g_left_0_1', 'loser');
markOutcome('g_left_0_2', 'loser');
markOutcome('g_left_0_3');
markOutcome('g_left_0_4');
markOutcome('g_left_0_5', 'loser');
markOutcome('g_left_0_6', 'loser');
markOutcome('g_left_0_7');

addTextToNameBox('g_left_1_0', 'Kleb aerogenes');
addTextToNameBox('g_left_1_1', 'RSV');
addTextToNameBox('g_left_1_2', 'ESBL E. coli');
addTextToNameBox('g_left_1_3', 'Strep pneumo');

markOutcome('g_right_0_0');
markOutcome('g_right_0_1', 'loser');
markOutcome('g_right_0_2', 'loser');
markOutcome('g_right_0_3');
markOutcome('g_right_0_4');
markOutcome('g_right_0_5', 'loser');
markOutcome('g_right_0_6', 'loser');
markOutcome('g_right_0_7');

addTextToNameBox('g_right_1_0', 'VRE');
addTextToNameBox('g_right_1_1', 'Staph lugdunensis');
addTextToNameBox('g_right_1_2', 'MSSA');
addTextToNameBox('g_right_1_3', 'Rickettsia');

// Round two
markOutcome('g_left_1_0', 'loser');
markOutcome('g_left_1_1');
markOutcome('g_left_1_2', 'loser');
markOutcome('g_left_1_3');

addTextToNameBox('g_left_2_0', 'RSV');
addTextToNameBox('g_left_2_1', 'Strep pneumo');

markOutcome('g_right_1_0');
markOutcome('g_right_1_1', 'loser');
markOutcome('g_right_1_2');
markOutcome('g_right_1_3', 'loser');

addTextToNameBox('g_right_2_0', 'VRE');
addTextToNameBox('g_right_2_1', 'MSSA');
