import React from "react";

export const PlayGameButton = ({ setIsVisible, playAgain, setPlayAgain, score, setScore }) => {

    const buttonHandle = () => {
        setIsVisible(false);
        setPlayAgain(true);
        setScore(0);
    }

    return (
        <div className="modal">
            <button onClick={buttonHandle}>{playAgain ? 'PLAY AGAIN' : 'PLAY GAME'}</button>
            {playAgain && <div className='game-score'>YOUR SCORE IS {score}</div>}
        </div>
    );
};
export default PlayGameButton;