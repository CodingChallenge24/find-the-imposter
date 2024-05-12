import { useState } from 'react'
import personBlack from './assets/peopleBlack.png'
import personRed from './assets/peopleRed.png'

function IconButton({id}) {

    const [count, setCount] = useState(0)

    function handleClick() {
        setCount((count + 1) % 2);
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

    let row = [];
    let index = 0
    const perRow = 30;
    for (let j = 0; j <= (noImposter - 1) / perRow; j ++) {
        let imposters = [];

        let cnt = Math.min(noImposter - j * perRow, perRow);
        for (let i = 0; i < cnt; i ++) {
            imposters.push(<IconButton id = {index + 1}/>);
            index ++;
        }
        row.push(<div className='ImposterRow flex flex-wrap gap-4 justify-center'>{imposters}</div>)
    }
    return (
        <div className='ImposterTable w-full'>
            {row}
        </div>
    )
}