import React from 'react';

const Snake = ({snake}) => {
    return (
        <div>
            {snake.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,                 //X coordinate of snake
                    top: `${dot[1]}%`                   //Y coordinate of snake
                }
                return (
                    <div className='snake' key={i} style={style}></div>
                )
            })}
        </div>
    );
}
export default Snake;