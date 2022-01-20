import React from 'react';

const Snake = ({snake}) => {
    return (
        <div>
            {snake.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,              
                    top: `${dot[1]}%`               
                }
                return (
                    <div className='snake' key={i} style={style}></div>
                )
            })}
        </div>
    );
}
export default Snake;