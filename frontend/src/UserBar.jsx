import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

import peopleBlack from './assets/peopleBlack.png'
import peopleRed from './assets/peopleRed.png'
import peopleYellow from './assets/peopleYellow.png'
import peopleGreen from './assets/peopleGreen.png'
import { URL } from './socket';

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
    const [totalQuery, setTotalQuery] = useState(0);
    const socket = io(URL, {
        autoConnect: false,
    })

    useEffect(() => {
        console.log(participant);
        console.log(socket);
        socket.connect();
        socket.on('answer_view', (data) => {
            if (data.id !== participant.id) return;
            const { answer } = data;
            let mask = 0;
            answer.split(' ').forEach((num) => {
                if (isNaN(num) || num < 1) return;
                mask |= (1 << (parseInt(num) - 1));
            });
            console.log(mask);
            setChoosingMask((prev) => prev | mask);
        })

        socket.on('show_score', (data) => {
            console.log(data);
            let total = 0;
            for (let i = 0; i < noImposter; i++) {
                if (choosingMask & (1 << i))
                    total ++;
            }
            if (total < noImposter / 3 || total > noImposter * 2 / 3) {
                setScore(0);
                return;
            }
            const answer = data.imposterPositions;
            let mask = 0;
            answer.forEach((num) => {
                if (isNaN(num)) return;
                mask |= (1 << (parseInt(num) - 1));
            });
            console.log(mask);
            
            for (let i = 0; i < noImposter; i++) {
                if (mask & (1 << i) && choosingMask & (1 << i))
                    setScore((prev) => prev + 1);
                if (!(mask & (1 << i)) && !(choosingMask & (1 << i)))
                    setScore((prev) => prev + 1);
            }
        })

        socket.on('query_view', (data) => {
            if (data.id !== participant.id) return;
            setTotalQuery((prev) => prev + 1);
        })

        socket.on('start', () => {
            setChoosingMask(0);
            setScore(0);
            setTotalQuery(0);
        })

        return () => {
            socket.off('answer_view');
            socket.off('show_score');
            socket.off('query_view');
            socket.disconnect();
        }
    }, [choosingMask, socket]);

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
            <div className='flex flex-col gap-2 items-start'>
                <p className='text-lg'>Query: {totalQuery}</p>
                <p>{score}</p>
                <p className='text-lg'>Points: {Math.round(score * noImposter / 50 + 0.4)} / 50</p>
            </div>
        </div>
    )
}