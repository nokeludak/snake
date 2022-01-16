import React, { useCallback, useEffect, useState } from "react";
import Snake from "./Snake";
import Food from "./Food";

import "./Snake.css";

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

  return [x, y];
};

const SnakeGame = () => {
  const [reset, setReset] = useState(true);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [gameOverEffect, setGameOverEffect] = useState(false);

  const [food, setFood] = useState(getRandomCoordinates);
  const [speed, setSpeed] = useState(200);
  const [direction, setDirection] = useState("RIGHT");
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0],
  ]);

  function playAgain() {
    setGameOver();
    setSpeed(200);
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setDirection("RIGHT");

    setFood(getRandomCoordinates);
    setScore(0);
    setGameOverEffect(false);
  }

  useEffect(() => {
    checkIfOutOfBorders();
    checkIfCollapsed();
    setTimeout(() => moveSnake(snakeDots, checkIfEat()), speed + 1);
  }, [snakeDots]);

  useEffect(() => {
    // document.onkeydown = onKeyDown;
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          console.log("direction", direction);
          !["DOWN", "UP"].includes(direction) && setDirection("UP");
          break;
        case 40:
          !["DOWN", "UP"].includes(direction) && setDirection("DOWN");
          break;
        case 37:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("LEFT");
          break;
        case 39:
          !["LEFT", "RIGHT"].includes(direction) && setDirection("RIGHT");
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      console.log("direction return", direction);
    };
  }, [direction, setDirection]);

  const moveSnake = useCallback(
    (snakeDots, eaten) => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;

        default:
          break;
      }
      if (direction) {
        dots.push(head);

        eaten ? setFood(getRandomCoordinates()) : dots.shift();

        setSnakeDots([...dots]);
      }
    },
    [direction]
  );

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };

  const checkIfCollapsed = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };
  const increaseSpeed = () => {
    if (speed > 50) {                                       //Speed will be not increased if speed lower than 50
        setSpeed((speed) => speed - 10)                     //Increasing speed
    }
}


  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1];
    let newFood = food
    if (head[0] === newFood[0] && head[1] === newFood[1]) {
      setFood(getRandomCoordinates());
      enlargeSnake()
      setScore(score + 10);
      increaseSpeed()
      
    }
  };

  const enlargeSnake = () => {
    let newSnake = [...snakeDots];                              //Copy of a snake array
    newSnake.unshift([])                                    //Add a new element on first position of the snake array
    setSnakeDots(newSnake)                                      //Set a new enlarged snake
}
 

  const onGameOver = () => {
    handleGameOverEffect();
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setDirection(null);
    setReset(false);
    setGameOver(true);
  };

  const handleGameOverEffect = () => {
    setGameOverEffect(true);
  };

  return (
    <>
      <div className="game-area">
        <div className={`${gameOverEffect && "game-over"}`}></div>
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
      </div>
      <div className="btn">
        <h2>Score: {score}</h2>
        {gameOver && <button onClick={playAgain}>Play Again</button>}
      </div>
    </>
  );
};

export default SnakeGame;
