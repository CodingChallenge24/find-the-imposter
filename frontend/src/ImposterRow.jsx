import { useState } from 'react'
import personBlack from './assets/peopleBlack.png'
import personRed from './assets/peopleRed.png'

function IconButton({id}) {

    const [count, setCount] = useState(0)

    function handleClick() {
        setCount((count + 1) % 2);
    }

    if (count === 0) {
        return (
            <div className='innerCell'>
                <h4>{id}</h4>
                <button className="buttonCell" onClick={handleClick}>
                    <img className="icon" src={personBlack} />
                </button>
            </div>
        )
    }
    else {
        return (
            <div className='innerCell'>
                <h4>{id}</h4>
                <button className="buttonCell" onClick={handleClick}>
                    <img className="icon" src={personRed} />
                </button>
            </div>
        )
    }
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
        row.push(<div className='ImposterRow'>{imposters}</div>)
    }

    console.log(row);
    return (
        <div className='ImposterTable'>
            <h2>Flag sections</h2>
            {row}
        </div>
    )
}