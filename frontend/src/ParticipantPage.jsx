import { useEffect, useRef, useState } from "react";
import ImposterRow from '../src/ImposterRow.jsx'
import Timer from '../src/Timer.jsx'
import { socket } from "./socket.js";
// import { Socket } from "socket.io-client";
import './App.css'
import RespondBox from "./RespondBox.jsx";

// function validateQuery(query) {
//     s = query.replace(/\s+/g, ' ').trim()
//     if (s[0] !== '?') {
//         return false;
//     }
//     return true;
// }

// function validateAnswer(answer) {
//     s = answer.replace(/\s+/g, ' ').trim()
//     if (s[0] !== '!') {
//         return false;
//     }
//     return false;
// }

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


function QueryBox({name, id, isFreeze=false}) {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        socket.on('ask', (data) => {
            console.log(data)
        })

        socket.on('query', (data) => {
            console.log(input);
            const ans = data['answer']
            // alert(`Query: ${input} ${ans}`);
            setHistory(prev => [...prev, `${input} ${ans}`]);
            setInput('');
        });

        socket.on('start', (data) => {
            setHistory([]);
        })

        return () => {
            socket.off('query');
            socket.off('ask');
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
        socket.emit('query', {id, query: input});
        // history.push(`${input}`);
    }


    if (isFreeze) {
        return (
            <div id ="box1">
                <HistoryBox history={history}/>
                <form id="queryForm" className="flex gap-2 mt-2" onSubmit={(even)=>{even.preventDefault();}}>
                    <label className="text-lg" htmlFor="queryBox">Ask:</label>
                    <input className="w-full" placeholder="? 1 2 3" type="text" value={input} onChange={handleChange} />
                    <button type="submit">Freezed</button>
                </form>
            </div>
        );
    } else {

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
}


function AnswerBox({name, id, isFreeze=false}) {
    const [input, setInput] = useState('');
    function handleChange(event) {
        setInput(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit('query', {query: input});
        socket.emit('answer', {id, answer: input});
        setInput('');
    }

    if (isFreeze) {
        return (
            <form className="flex gap-2 mt-2" onSubmit={(even)=>{even.preventDefault();}}>
                <label htmlFor="answerBox">Answer:</label>
                <input className="w-full" id="answerBox" placeholder="! 1 30" type="text" value={input} onChange={handleChange} />
                <button type="submit">Freezed</button>
            </form>
        )
    } else {

        return (
            <form className="flex gap-2 mt-2" onSubmit={handleSubmit}>
                <label htmlFor="answerBox">Answer:</label>
                <input className="w-full" id="answerBox" placeholder="! 1 30" type="text" value={input} onChange={handleChange} />
                <button type="submit">Send</button>
            </form>
        )
    }
}

export default function ParticipantPage() {
    const [imposters, setImposters] = useState(0);
    const [isFreeze, setIsFreeze] = useState(false);
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        socket.connect();

        socket.on('start', (data) => {
            console.log(data);
            setImposters(data.numPlayers);
            setIsFreeze(false);
            setTime(300);
        });

        socket.on('score', (data) => {
            console.log(data);
            setScore(data.scores[user.id]);
        });

        return () => {
            socket.off('start');
            socket.off('score');
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        if (time === 0) return;

        const timeout = setTimeout(() => {
            setIsFreeze(true);
        }, time * 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [time]);

    return (
        <section>
            <p>{isFreeze ? 'a' : 'b'}</p>
            <p>Thí sinh: {user.fullname} </p>
            <p>Điểm: {score}</p>
            <h2 className='text-3xl mb-6'>Flag section</h2>
            <ImposterRow isFreeze={isFreeze} id={user.id} noImposter={imposters}/>
            <div className="flex justify-center mt-8">
                <div>
                    <QueryBox name ={user.fullname} id ={user.id} isFreeze ={isFreeze}/>
                    {/* <AnswerBox name ={user.fullname} id ={user.id} isFreeze ={isFreeze}/> */}
                    {
                        time > 0 && <Timer setTime={setTime} time={time}/>
                    }
                </div>
            </div>
            <RespondBox></RespondBox>
        </section>
    )
}