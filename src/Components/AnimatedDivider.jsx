import React from 'react';

function AnimatedDivider({ marginClass }) {
    return (
        <div>
            <div className={`${marginClass} w-full h-1 bg-[linear-gradient(to_right,#CCFF00,#00FFC5,#FF33F6,#FFC400,#7700FF)] bg-size-[200%_auto] animate-[pulse_3s_ease-in-out_infinite]`} />
        </div>
    );
}
export default AnimatedDivider; 
