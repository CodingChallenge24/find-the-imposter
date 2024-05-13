import { useState } from 'react'
import personBlack from './assets/peopleBlack.png'
import personRed from './assets/peopleRed.png'

function IconButton({id, setCurrentOn, currentOn}) {

    const [count, setCount] = useState(0)

    function handleClick() {
        setCount((count + 1) % 2);
        setCurrentOn(currentOn ^ (1 << (id - 1)));
    }

    return (
        <div className='innerCell'>
            <h4 className='text-2xl'>{id}</h4>
            <button className="p-2 bg-slate-300 w-[50px]" onClick={handleClick}>
                <img className='w-full' src={count === 0 ? personBlack : personRed} />
            </button>
        </div>
    )
}


export default function ImposterRow({ noImposter }) { // noImposter is the number of button to display
    const [currentOn, setCurrentOn] = useState(0);

    let row = [];
    let index = 0
    const perRow = 30;
    for (let j = 0; j <= (noImposter - 1) / perRow; j ++) {
        let imposters = [];

        let cnt = Math.min(noImposter - j * perRow, perRow);
        for (let i = 0; i < cnt; i ++) {
            imposters.push(<IconButton id = {index + 1} setCurrentOn={setCurrentOn} currentOn={currentOn}/>);
            index ++;
        }
        row.push(<div className='ImposterRow flex flex-wrap gap-4 justify-center'>{imposters}</div>)
    }

    function handleCopy() {
        let copyText = ""
        let listOn = []
        copyText += '! '
        for (let i = 0; i < 30; i ++)
            if (currentOn >> i & 1)
                listOn.push(`${i + 1}`);

        listOn.forEach((num) => {copyText += num + ' ';})

        console.log(copyText)
        navigator.clipboard.writeText(copyText);
    }

    return (
        <div className='ImposterTable w-full'>
            {row}
            <button className="mt-2 p-2 bg-slate-300 w-[50px]" onClick={handleCopy}>Copy</button>
        </div>
    )
}