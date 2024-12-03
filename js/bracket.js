const SVG_NS = 'http://www.w3.org/2000/svg';
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
	nameBox: { height: 50, width: 165, textOffset: 30, flagOffset: 15 },
	offsets: { vertical: 100, horizontal: 250, padding: 50 },
};

const BRACKET_VIEWBOX = `0 0 ${DIMENSIONS.window.width + DIMENSIONS.offsets.padding * 2} ${
	DIMENSIONS.window.height + DIMENSIONS.offsets.padding * 2 + DIMENSIONS.window.titleHeight
}`;

const results = {
	participants: {
		left: [
			'Kleb aerogenes',
			'MRSA',
			'Candida albicans',
			'RSV',
			'ESBL E. coli',
			'C diff',
			'Strep pyogenes',
			'Strep pneumo',
		],
		right: [
			'VRE',
			'CRE',
			'HIV',
			'Staph lugdunensis',
			'MSSA',
			'Pseudomonas',
			'Syphilis',
			'Rickettsia',
		],
	},
	rounds: {
		left: [],
		right: [],
	},
};

let board = {
	year: 2024,
	version: 1,
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
	DIMENSIONS.offsets.padding + DIMENSIONS.window.width - 164,
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
	console.log('fillBoard');

	const sections = ['left_1', 'left_2', 'left_3', 'right_1', 'right_2', 'right_3'];

	for (const section of sections) {
		for (const [index, match] of Object.entries(board[section])) {
			if (match !== null) {
				console.log('`${section}_${index}`', `${section}_${index}`);
				document.getElementById(`${section}_${index}`).textContent = match;
			}
		}
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

function verifyBracketComplete() {
	console.log(board);
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

BRACKET_FORM.addEventListener('submit', (e) => {
	if (verifyBracketComplete()) {
		ENCODED_SEED.value = encodeBoard(board);
		sendUserFeedback(THINKING_CONTAINER);
	} else {
		e.preventDefault();
	}
});

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
	const title = document.createElementNS(SVG_NS, 'text');
	title.setAttribute('x', DIMENSIONS.window.width / 2 + DIMENSIONS.offsets.padding);
	title.setAttribute('y', DIMENSIONS.window.titleHeight / 2 + 30);
	title.setAttribute('text-anchor', 'middle');
	title.setAttribute('font-size', '40');
	title.textContent = 'Your 2024 Bracket!';
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
	console.log('boardUpdate');
	setURL();
}

function handleNameBoxClick(roundIndex, matchIndex, isMirrored = false) {
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
		console.log('currentText', currentText);
		document.getElementById('overall_winner').textContent = currentText;
	}

	boardUpdate();
}

function createNameBox(x, y, name, winner, isMirrored = false, onClick = null, id = null) {
	const nameBox = document.createElementNS(SVG_NS, 'g');

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
			'lightgray'
		)
	);

	const flagColor =
		winner === true ? COLORS.winner : winner === false ? COLORS.loser : COLORS.neutral;
	const flagX = isMirrored ? x + DIMENSIONS.nameBox.width - DIMENSIONS.nameBox.flagOffset : x;
	nameBox.appendChild(
		createRect(flagX, y, DIMENSIONS.nameBox.height, DIMENSIONS.nameBox.flagOffset, flagColor)
	);

	const textX = isMirrored
		? x + DIMENSIONS.nameBox.width - DIMENSIONS.nameBox.textOffset + 10
		: x + DIMENSIONS.nameBox.textOffset - 10;

	if (activeLinks) {
		nameBox.appendChild(
			createLink(textX, y + DIMENSIONS.nameBox.textOffset, name, `#${name}`, isMirrored)
		);
	} else {
		nameBox.appendChild(
			createText(textX, y + DIMENSIONS.nameBox.textOffset, name, isMirrored, false, id)
		);
	}

	return nameBox;
}

function createLink(x, y, text, href, isMirrored, target = '_blank') {
	const link = document.createElementNS(SVG_NS, 'a');
	link.setAttribute('href', href);
	link.setAttribute('target', target);
	link.appendChild(createText(x, y, text, isMirrored, true));

	return link;
}

function createText(x, y, text, isMirrored, link = false, id = null, anchor = null) {
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
	textElement.textContent = text;

	return textElement;
}

function createRect(x, y, height, width, fill, radius = 0, mouseoverFill = false) {
	const rect = document.createElementNS(SVG_NS, 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('height', height);
	rect.setAttribute('width', width);

	if (mouseoverFill && !activeLinks) {
		console.log('mouseover');
		rect.addEventListener('mouseover', () => {
			rect.setAttribute('fill', mouseoverFill);
		});
		rect.addEventListener('mouseout', () => {
			rect.setAttribute('fill', fill);
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
	const adjustedEndX = isMirrored ? end.x + DIMENSIONS.nameBox.width + 113 : end.x;

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
	const oversizeWith = 50;
	const oversizeHeight = 10;

	const centerX =
		DIMENSIONS.window.width / 2 - DIMENSIONS.nameBox.width / 2 + DIMENSIONS.offsets.padding;
	const centerY =
		DIMENSIONS.window.height / 2 -
		DIMENSIONS.nameBox.height / 2 +
		DIMENSIONS.offsets.padding +
		DIMENSIONS.window.titleHeight;

	const offsetY = 140;

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
		centerY + DIMENSIONS.nameBox.height / 2 + offsetY + 5,
		null,
		false,
		false,
		'overall_winner',
		'middle'
	);
	winnerBox.appendChild(winnerText);

	const winnerTitle = createText(
		centerX + DIMENSIONS.nameBox.width / 2,
		centerY - DIMENSIONS.nameBox.height / 2 + offsetY + 5,
		'🏆 Overall Winner 🏆',
		false,
		false,
		null,
		'middle'
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
