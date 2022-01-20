import React from 'react';

const Food = ({ food }) => {
    const style = {
        left: `${food[0]}%`,            //X coordinate of food
        top: `${food[1]}%`              //Y coordinate of food
    }
    return (
        <div className='food' style={style}></div>
    );
}
export default Food;