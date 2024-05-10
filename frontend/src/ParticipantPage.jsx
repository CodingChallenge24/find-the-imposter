import { useState } from "react";
import ImposterRow from '../src/ImposterRow.jsx'
import Timer from '../src/Timer.jsx'
import { socket } from "./socket.js";
// import { Socket } from "socket.io-client";



function HistoryBox({history}) {
    return (
        <div id="historyBox">
            {history.map((item, index) => (
                <p key={index} style={{backgroundColor: index % 2 === 0 ? "lightgray" : "white", margin: "1px", padding: "1px"}}>{item}</p>
            ))}
        </div>
    );
}


function QueryBox({ query, setQuery, history, name, id}) {

    const [input, setInput] = useState(query);

    function handleChange(event) {
        setInput(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setQuery(input);
        // alert(`Query: ${input}`);
        // console.log('{"query": "' + input + '"}')
        // const myQuery = JSON.stringify({query: input})
        // socket.emit('ask', myQuery);
        // socket.on('ask', (data) => {
        //     console.log(data)
        // })
        // alert(history)



        setInput('');
    }

    return (
        <div id ="box1">
            <HistoryBox history={history}/>
            <form id="queryForm" onSubmit={handleSubmit}>
                <input id="queryBox" type="text" value={input} onChange={handleChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}


function AnswerBox({name, id}) {
    const [input, setInput] = useState('');
    function handleChange(event) {
        setInput(event.target.value);
    }

    function handleSubmit(event) {
        alert(`Answer: ${input}`);
    }

    const buttStyle = {
        margin: "5px",
        borderRadius: "3px",
        border: "1px solid black",
        width: "90px",
    }

    return (
        <form id="answerForm" onSubmit={handleSubmit}>
            <input id="answerBox" type="text" value={input} onChange={handleChange} />
            <button type="submit" style={buttStyle}>Answer</button>
        </form>
    )
}

export default function ParticipantPage({name, id, noImposter}) {

    let history = []

    return (
        <>
            <ImposterRow noImposter={noImposter}/>
            <div id = "box2">
                <QueryBox query="" setQuery={console.log} history={history} name ={name} id ={id}/>
                <div>
                    <div className="userInfo">
                        <h4 className="info">{`Username: ${name}`}</h4>
                        <h4 className="info">{`User ID: ${id}`}</h4>
                    </div>
                    <AnswerBox name ={name} id ={id}/>
                    <Timer time={300}/>
                </div>
            </div>
        </>
    )
}