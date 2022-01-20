import React, { useState, useEffect, useCallback } from 'react';
import Snake from './Snake';
import Food from './Food';
import { PlayGameButton } from './PlayGameButton.js';



const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y]
}

let interval = null;                                               

const Game = () => {

    const [snake, setSnake] = useState([[0, 0], [2, 0], [4, 0]])   
    const [food, setFood] = useState(getRandomCoordinates())       
    const [directions, setDirections] = useState('RIGHT');          
    const [speed, setSpeed] = useState(300);                        
    const [score, setScore] = useState(0);                         
    const [isVisible, setIsVisible] = useState(true);              
    const [playAgain, setPlayAgain] = useState(false);              


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
        let newSnake = [...snake];                          
        let head = newSnake[newSnake.length - 1];                  

        switch (directions) {
            case 'RIGHT':
                head = [head[0] + 2, head[1]];             
                break;
            case 'LEFT':
                head = [head[0] - 2, head[1]];             
                break;
            case 'DOWN':
                head = [head[0], head[1] + 2];              
                break;
            case 'UP':
                head = [head[0], head[1] - 2];              
                break;
            default:
                break;
        }
        newSnake.push(head);                                
        newSnake.shift();                                  
        setSnake(newSnake);                                 
    }, [directions, snake])


    //Check if snake touch a border
    const checkIfTouchBorders = () => {
        let head = snake[snake.length - 1];                                    
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {  
            gameOver();
        }
    }

    //Check if a snake touch yourself
    const checkIfCollapsed = () => {
        let newSnake = [...snake];                          
        let head = newSnake[newSnake.length - 1];           
        newSnake.pop();
        newSnake.forEach(dot => {
            if (head[0] === dot[0] && head[1] === dot[1]) { 
                gameOver();
            }
        })
    }

    //Check if the snake eat a fruit
    const checkIfEat = () => {
        let head = snake[snake.length - 1];                    
        let newFood = food;                                     
        if (head[0] === newFood[0] && head[1] === newFood[1]) { 
            setFood(getRandomCoordinates())                     
            enlargeSnake();                                     
            increaseSpeed();                                   
            setScore((score) => score + 1)                     
        }
    }

    //Function for enlarge a snake body
    const enlargeSnake = () => {
        let newSnake = [...snake];                             
        newSnake.unshift([])                                  
        setSnake(newSnake)                                     
    }

    //Function for increace the speed
    const increaseSpeed = () => {
        if (speed > 50) {                                       
            setSpeed((speed) => speed - 10)                    
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