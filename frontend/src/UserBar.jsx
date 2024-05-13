import { useEffect, useState } from 'react'
import { socket } from './socket.js'

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
        <img className="sprite w-[50px]" src={color} alt={state} />
    )
}

export default function UserBar({participant, noImposter }) {
    const [choosingMask, setChoosingMask] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        socket.connect();
        socket.on('answer_view', (data) => {
            if (data.id !== participant.id) return;
            const { answer } = data;
            let mask = 0;
            answer.split(' ').forEach((num) => {
                if (isNaN(num)) return;
                mask |= (1 << (parseInt(num) - 1));
            });
            setChoosingMask((prev) => prev | mask);
        })

        socket.on('show_score', (data) => {
            console.log(data);
            const answer = data.imposterPositions;
            let mask = 0;
            answer.forEach((num) => {
                if (isNaN(num)) return;
                mask |= (1 << (parseInt(num) - 1));
            });
            
            for (let i = 0; i < noImposter; i++) {
                if (mask >> i & 1 && choosingMask >> i & 1)
                    setScore((prev) => prev + 1);
            }
        })

        return () => {
            socket.off('answer_view');
            socket.off('show_score');
            socket.disconnect();
        }
    }, [choosingMask]);

    let spriteList = []
    for (let i = 0; i < noImposter; i++) {
        if (choosingMask >> i & 1)
            spriteList.push(Sprite({state: "yellow"}));
        else
            spriteList.push(Sprite({state: "black"}));
    }

    return (
        <div className="grid grid-cols-4 items-center">
            <p className='text-lg'>{participant.name}</p>
            <div className='col-span-2 flex flex-wrap justify-center'>
                {spriteList}
            </div>
            <p className='text-lg'>{Math.round(score * 1.6 + 0.4)} / 50</p>
        </div>
    )
}