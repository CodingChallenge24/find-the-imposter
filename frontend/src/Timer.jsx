import React, { useState, useEffect } from 'react';

const Timer = ({ time, setTime }) => {
    useEffect(() => {
        const interval = setInterval(() => {
        setTime(prevSeconds => {
            if (prevSeconds === 0) {
            clearInterval(interval);
            return 0;
            } else {
            return prevSeconds - 1;
            }
        });
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;

    const timerStyle = {
        color: time < 10 ? "red" : "black",
        width: "90px",
        height: "35px",
        border: "1px solid black",
        margin: "5px",
    }

    const textStyle = {
        fontSize: "20px",
        fontWeight: "bold",
    }

    return (
        <div className='flex items-center'>
            <p>Time left:</p>
            <div style={timerStyle}>
                <span style={textStyle}>{minutes < 10 ? `0${minutes}` : minutes}</span><span style={textStyle}> : </span>
                <span style={textStyle}>{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}</span>
            </div>
        </div>
    );
};

export default Timer;
