import { useEffect, useState } from "react";
import { COLORS, width } from "../constants";
import '../board/Board.css'


const generateRandomColorConfiguration = () => {
    const randomColorConfiguration = Array.from({ length: width * width }, () => {
      const colorRandom = COLORS[Math.floor(Math.random() * COLORS.length)];
      return colorRandom;
    });
    return randomColorConfiguration;
  };


export const Borad = () => {
	const [currentBoard, setCurrentBoard] = useState([]);

	

	useEffect(() => {
		setCurrentBoard(generateRandomColorConfiguration());
	}, []);

	return <>
    <div className="board">
        {currentBoard.map((candy,index)=>(
            <img key={index} style={{backgroundColor:candy}}></img>
        ))}
    </div>
    </>;
};
