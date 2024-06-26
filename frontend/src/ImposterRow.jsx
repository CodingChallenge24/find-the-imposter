import { useEffect, useState } from 'react'
import personBlack from './assets/peopleBlack.png'
import personRed from './assets/peopleRed.png'
import { socket } from './socket.js'

function IconButton({disabled, id, setCurrentOn, currentOn}) {
    function handleClick() {
        setCurrentOn(currentOn ^ (1 << (id - 1)));
    }

    return (
        <div className='innerCell'>
            <h4 className='text-2xl'>{id}</h4>
            <button disabled={disabled} className="p-2 bg-slate-300 w-[50px]" onClick={handleClick}>
                <img className='w-full' src={(currentOn & (1 << (id - 1))) === 0 ? personBlack : personRed} />
            </button>
        </div>
    )
}


export default function ImposterRow({ isFreeze, id, noImposter, setIsFreeze}) { // noImposter is the number of button to display
    const [currentOn, setCurrentOn] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    let row = [];
    let index = 0
    const perRow = 30;
    for (let j = 0; j <= (noImposter - 1) / perRow; j ++) {
        let imposters = [];

        let cnt = Math.min(noImposter - j * perRow, perRow);
        for (let i = 0; i < cnt; i ++) {
            imposters.push(<IconButton disabled={isSubmitted || isFreeze} id = {index + 1} setCurrentOn={setCurrentOn} currentOn={currentOn} />);
            index ++;
        }
        row.push(<div className='ImposterRow flex flex-wrap gap-4 justify-center'>{imposters}</div>)
    }

    useEffect(() => {
        socket.on('start', () => {
            setIsSubmitted(false);
            setCurrentOn(0);
        })
    }, [])

    useEffect(() => {
        if (!isFreeze) return;
        if (isSubmitted) return;
        handleSubmit();
    }, [isFreeze])

    function handleSubmit() {
        let input = ""
        let listOn = []
        input += '! '
        for (let i = 0; i < 30; i ++)
            if (currentOn >> i & 1)
                listOn.push(`${i + 1}`);

        listOn.forEach((num) => {input += num + ' ';})
        socket.emit('query', {query: input});
        socket.emit('answer', {id, answer: input});
        setIsSubmitted(true);
        setIsFreeze(true);
        // alert("12312312312");
        // console.log(123);
    }

    return (
        <div className='ImposterTable w-full'>
            {row}
            <button disabled={isSubmitted || isFreeze} className="mt-2 p-2 bg-slate-300" onClick={handleSubmit}>Submit</button>
        </div>
    )
}