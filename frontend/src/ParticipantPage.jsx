import { useEffect, useRef, useState } from "react";
import ImposterRow from '../src/ImposterRow.jsx'
import Timer from '../src/Timer.jsx'
import { socket } from "./socket.js";
// import { Socket } from "socket.io-client";
import './App.css'



function HistoryBox({history}) {
    // console.log(history)
    return (
        <>
            <h4 className="text-lg">Query history</h4>
            <div id="historyBox" className="rounded-md">
                {history.map((item, index) => (
                    <p key={index} style={{backgroundColor: index % 2 === 0 ? "lightgray" : "white", margin: "1px", padding: "1px"}}>{item}</p>
                ))}
            </div>
        </>
    );
}


function QueryBox({name, id}) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        socket.on('query', (data) => {
            console.log(data)
        })

        socket.on('query', (data) => {
            console.log(input);
            const ans = data['answer']
            // alert(`Query: ${input} ${ans}`);
            setHistory(prev => [...prev, `${input} ${ans}`]);
            setInput('');
        });

        return () => {
            socket.off('query');
        }
    }, [input])

    function handleChange(event) {
        setInput(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        // setQuery(input);
        alert(`Query: ${input}`);
        console.log('{"query": "' + input + '"}')
        // const myQuery = JSON.stringify({query: input})
        socket.emit('query', {query: input});
        // history.push(`${input}`);
    }

    return (
        <div id ="box1">
            <HistoryBox history={history}/>
            <form id="queryForm" className="flex gap-2 mt-2" onSubmit={handleSubmit}>
                <label className="text-lg" htmlFor="queryBox">Ask:</label>
                <input className="w-full" placeholder="? 1 2 3" type="text" value={input} onChange={handleChange} />
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
        // alert(`Answer: ${input}`);
        event.preventDefault();
        socket.emit('query', {query: input});
        socket.on('query', (data) => {
            const ans = data['answer']
            const accuracy = data['accuracy']
            const posMatch = data['posMatch']
            alert(`Answer: ${ans}\nAccuracy: ${accuracy}\nPosition Match: ${posMatch}`);
            socket.off('query');
        })
    }

    return (
        <form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
            <label htmlFor="answerBox">Answer:</label>
            <input className="w-full" id="answerBox" placeholder="! 30" type="text" value={input} onChange={handleChange} />
            <button type="submit">Send</button>
        </form>
    )
}

export default function ParticipantPage() {
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        }
    }, [])

    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <section>
            <p>Thí sinh: {user.fullname} </p>
            <h2 className='text-3xl mb-6'>Flag section</h2>
            <ImposterRow noImposter={30}/>
            <div className="flex justify-center mt-8">
                <div>
                    <QueryBox name ={user.fullname} id ={user.id}/>
                    <AnswerBox name ={user.fullname} id ={user.id}/>
                    <Timer time={300}/>
                </div>
            </div>
        </section>
    )
}