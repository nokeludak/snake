import React, { useState, useEffect, useCallback } from 'react';
import Snake from './Snake';
import Food from './Food';
import { PlayGameButton } from './PlayGameButton.js';

//This function returns two integers array
//This array represents random coordinates used to place a food
const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y]
}

let interval = null;                                                //interval declarations

const Game = () => {

    const [snake, setSnake] = useState([[0, 0], [2, 0], [4, 0]])    //Snake has three segments, Each segment has x and y coordinate
    const [food, setFood] = useState(getRandomCoordinates())        //Food is set with random coordinates
    const [directions, setDirections] = useState('RIGHT');          //Default direction is right
    const [speed, setSpeed] = useState(300);                        //Speed of the snake
    const [score, setScore] = useState(0);                          //Score
    const [isVisible, setIsVisible] = useState(true);               //Check if modal is visible
    const [playAgain, setPlayAgain] = useState(false);              //Check is it Play game or Play again button


    //Functions for set directions depends whick key is pressed
    const onKeyDown = (e) => {
        e = e || window.event;
        switch (e.keyCode) {
            case 38:
                setDirections('UP');
                break;
            case 40:
                setDirections('DOWN');
                break;
            case 37:
                setDirections('LEFT');
                break;
            case 39:
                setDirections('RIGHT');
                break;
            default:
                break;
        }
    }

    //Move snake function
    const moveSnake = useCallback(() => {
        let newSnake = [...snake];                          //Copy of snake
        let head = newSnake[newSnake.length - 1];           //Head is a last item of snake array        

        switch (directions) {
            case 'RIGHT':
                head = [head[0] + 2, head[1]];              //If snake moves right x coordinate is increased by 2
                break;
            case 'LEFT':
                head = [head[0] - 2, head[1]];              //If snake moves left x coordinate is decreased by 2
                break;
            case 'DOWN':
                head = [head[0], head[1] + 2];              //If snake moves down y coordinate is increased by 2
                break;
            case 'UP':
                head = [head[0], head[1] - 2];              //If snake moves up y coordinate is decreased by 2
                break;
            default:
                break;
        }
        newSnake.push(head);                                //New head of snake
        newSnake.shift();                                   //Remove first item of snake array
        setSnake(newSnake);                                 //Set new snake
    }, [directions, snake])


    //Check if snake touch a border
    const checkIfTouchBorders = () => {
        let head = snake[snake.length - 1];                                     //Snake head
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {   //If snake head touch a border game is over
            gameOver();
        }
    }

    //Check if a snake touch yourself
    const checkIfCollapsed = () => {
        let newSnake = [...snake];                          //Copy of the snake
        let head = newSnake[newSnake.length - 1];           //Snake head
        newSnake.pop();
        newSnake.forEach(dot => {
            if (head[0] === dot[0] && head[1] === dot[1]) { //If snake touch her body game is over
                gameOver();
            }
        })
    }

    //Check if the snake eat a fruit
    const checkIfEat = () => {
        let head = snake[snake.length - 1];                     //Snake head
        let newFood = food;                                     //Food from state
        if (head[0] === newFood[0] && head[1] === newFood[1]) { //If the snake touch a food
            setFood(getRandomCoordinates())                     //Set a new food
            enlargeSnake();                                     //Enlarge snake body
            increaseSpeed();                                    //Incrase the speed
            setScore((score) => score + 1)                      //Increment score by one
        }
    }

    //Function for enlarge a snake body
    const enlargeSnake = () => {
        let newSnake = [...snake];                              //Copy of a snake array
        newSnake.unshift([])                                    //Add a new element on first position of the snake array
        setSnake(newSnake)                                      //Set a new enlarged snake
    }

    //Function for increace the speed
    const increaseSpeed = () => {
        if (speed > 50) {                                       //Speed will be not increased if speed lower than 50
            setSpeed((speed) => speed - 10)                     //Increasing speed
        }
    }

    //Function for game over
    const gameOver = () => {
        setSnake([[0, 0], [2, 0], [4, 0]])
        setFood(getRandomCoordinates())
        setDirections('RIGHT');
        setSpeed(400);
        setIsVisible(true);
    }


    //If Play game button is not visible game should start
    useEffect(() => {
        if (!isVisible) {
            interval = setInterval(moveSnake, speed);
        }
        window.addEventListener('keydown', onKeyDown);
        return () => {
            clearInterval(interval)
            window.addEventListener('keydown', onKeyDown)
        }
    }, [moveSnake, isVisible, speed, directions, snake])

    //Every time when the snake make a move check if toucha a board, touch her body or eat a fruit
    useEffect(() => {
        checkIfTouchBorders();
        checkIfCollapsed();
        checkIfEat();
    }, [snake])

    return (
        <div>
            <div className='score' >Score: {score}</div>
            <div className='playgame'>
                {isVisible && <PlayGameButton
                    score={score}
                    setScore={setScore}
                    setIsVisible={setIsVisible}
                    playAgain={playAgain}
                    setPlayAgain={setPlayAgain} />}
                <Snake snake={snake} />
                <Food food={food} />
            </div>
        </div>
    );
}
export default Game;