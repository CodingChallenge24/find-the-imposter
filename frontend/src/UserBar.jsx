import { useState } from 'react'

import peopleBlack from './assets/peopleBlack.png'
import peopleRed from './assets/peopleRed.png'
import peopleYellow from './assets/peopleYellow.png'
import peopleGreen from './assets/peopleGreen.png'

const yellow = peopleYellow;
const red = peopleRed;
const green = peopleGreen;
const black = peopleBlack;

function Sprite({state}) {
    let color = black
    if (state === "yellow") color = yellow;
    else if (state === "red") color = red;
    else if (state === "green") color = green;

    return (
        <img className="sprite" src={color} alt={state} />
    )
}

export default function UserBar({userName, noImposter, choosingMask, displayText}) {

    let spriteList = []
    for (let i = 0; i < noImposter; i++) {
        if (choosingMask >> i & 1)
            spriteList.push(Sprite({state: "yellow"}));
        else
            spriteList.push(Sprite({state: "black"}));
    }

    return (
        <div className="user-bar">
            <div className='sprite-container'>
                {spriteList}
            </div>
            <div className='spacing'></div>
            <text className='displayBox'>{displayText}</text>
        </div>
    )
}