import { useEffect, useState } from "react";
import { COLORS, width } from "../constants";
import "../board/Board.css";
import blank from "../img/blank.png";
import Score from "./Score";


import blueCandy from '../img/blue-candy.png'
import greenCandy from '../img/green-candy.png'
import orangeCandy from '../img/orange-candy.png'
import purpleCandy from '../img/purple-candy.png'
import redCandy from '../img/red-candy.png'
import yellowCandy from '../img/yellow-candy.png'


const generateRandomColorConfiguration = () => {
	const randomColorConfiguration = Array.from({ length: width * width }, () => {
		const colorRandom = COLORS[Math.floor(Math.random() * COLORS.length)];
		return colorRandom;
	});
	return randomColorConfiguration;
};

export const Borad = () => {
	const [currentBoard, setCurrentBoard] = useState([]);
	const [squareBeingDragged, setSquareBeingDragged] = useState(null);
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
	const [scoreDisplay, setScoreDisplay] = useState(0);

	useEffect(() => {
		setCurrentBoard(generateRandomColorConfiguration());
	}, []);

	const checkForMatchThree = () => {
		for (let i = 0; i <= 47; i++) {
			const columnOfThree = Array.from({ length: 3 }, (_, j) => i + j * width);
			const decidedColor = currentBoard[i];
			const isBlank = decidedColor === blank;

			if (
				columnOfThree.every(
					(square) => currentBoard[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((score) => score + 3);
				columnOfThree.forEach((square) => (currentBoard[square] = blank));
				return true;
			}
		}
	};
	const checkForRowOfThree = () => {
		const notValid = new Set([
			6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
		]);

		for (let i = 0; i < 64; i++) {
			if (notValid.has(i)) continue;

			const decidedColor = currentBoard[i];
			const isBlank = decidedColor === blank;

			if (
				[0, 1, 2].every((offset) => {
					const square = i + offset;
					return currentBoard[square] === decidedColor && !isBlank;
				})
			) {
				setScoreDisplay((score) => score + 3);

				for (let offset = 0; offset < 3; offset++) {
					const square = i + offset;
					currentBoard[square] = blank;
				}

				return true;
			}
		}
	};
	const checkForLineOfFour = (start, step, isVertical) => {
		const notValid = new Set([
			5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
			54, 55, 62, 63, 64,
		]);

		for (let i = 0; i < 64; i++) {
			if (notValid.has(i)) continue;

			const lineOfFour = [i, i + step, i + step * 2, i + step * 3];
			const decidedColor = currentBoard[i];
			const isBlank = decidedColor === blank;

			if (
				lineOfFour.every(
					(square) => currentBoard[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((score) => score + 4);
				lineOfFour.forEach((square) => (currentBoard[square] = blank));
				return true;
			}

			if (isVertical && i % width === width - 1) {
				i += 3;
			}
		}
	};

	const checkForColumnOfFour = () => {
		return checkForLineOfFour(0, 1, true);
	};

	const checkForRowOfFour = () => {
		return checkForLineOfFour(0, 1, false);
	};
	const moveIntoSquareBelow = () => {
		for (let i = 0; i <= 55; i++) {
		  const nextSquareIndex = i + width;
		  if (currentBoard[nextSquareIndex] === blank) {
			const randomNumber = Math.floor(
			  Math.random() * COLORS.length
			);
			currentBoard[nextSquareIndex] = COLORS[randomNumber];
			currentBoard[i] = blank;
		  }
		}
	  };
	  
	  

	const dragStart = (e) => {
		setSquareBeingDragged(e.target);
	};

	const dragDrop = (e) => {
		setSquareBeingReplaced(e.target);
	};

	const dragEnd = () => {
		const squareBeingDraggedId = parseInt(
			squareBeingDragged.getAttribute("data-id")
		);
		const squareBeingReplacedId = parseInt(
			squareBeingReplaced.getAttribute("data-id")
		);

		currentBoard[squareBeingReplacedId] =
			squareBeingDragged.getAttribute("src");
		currentBoard[squareBeingDraggedId] =
			squareBeingReplaced.getAttribute("src");

		const validMoves = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + 1,
			squareBeingDraggedId + width,
		];

		const isValidMove = validMoves.includes(squareBeingReplacedId);
		const isAColumnOfFour = checkForColumnOfFour();
		const isARowOfFour = checkForRowOfFour();
		const isAColumnOfThree = checkForMatchThree();
		const isARowOfThree = checkForRowOfThree();

		if (
			squareBeingReplacedId &&
			isValidMove &&
			(isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
		) {
			setSquareBeingDragged(null);
			setSquareBeingReplaced(null);
		} else {
			currentBoard[squareBeingReplacedId] =
				squareBeingReplaced.getAttribute("src");
			currentBoard[squareBeingDraggedId] =
				squareBeingDragged.getAttribute("src");
			setScoreDisplay(score => score + 1);
		}
	};
	
	useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForMatchThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentBoard([...currentBoard])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForMatchThree, checkForRowOfThree, moveIntoSquareBelow, currentBoard])

	return (
		<div className="app">
			<div className="game">
				{currentBoard.map((candyColor, index) => (
					<img className="candy"
						key={index}
						src={candyColor}
						alt={candyColor}
						data-id={index}
						draggable={true}
						onDragStart={dragStart}
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={(e) => e.preventDefault()}
						onDragLeave={(e) => e.preventDefault()}
						onDrop={dragDrop}
						onDragEnd={dragEnd}
					/>
				))}
			</div>
			<Score score={scoreDisplay}></Score>
		</div>
	);
};
