import { useState } from 'react'


function IconButton({id}) {

    const [count, setCount] = useState(0)

    function handleClick() {
        setCount((count + 1) % 2);
    }

    if (count === 0) {
        return (
            <div className='innerCell'>
                <h4>{id}</h4>
                <button onClick={handleClick}>🙋‍♂️</button>
            </div>
        )
    }
    else {
        return (
            <div className='innerCell'>
                <h4>{id}</h4>
                <button onClick={handleClick}>👲</button>
            </div>
        )
    }
}


export default function ImposterRow({ noImposter }) { // noImposter is the number of button to display

    let row = [];
    let index = 0
    for (let j = 0; j <= (noImposter - 1) / 10; j ++) {
        let imposters = [];

        let cnt = Math.min(noImposter - j * 10, 10);
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