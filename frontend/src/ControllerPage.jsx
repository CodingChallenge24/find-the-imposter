import { useEffect, useState } from "react"
import { socket } from "./socket.js"

const participants = [
    {
        id: 1,
        name: 'Contestant 1',
    },
    {
        id: 2,
        name: 'Contestant 2',
    },
    {
        id: 3,
        name: 'Contestant 3',
    },
    {
        id: 4,
        name: 'Contestant 4',
    },
]

export default function ControllerPage() {
    const [imposters, setImposters] = useState(0);
    const [results, setResults] = useState("");
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role !== 'controller') {
            window.location.href = '/';
        }
        socket.connect();
        setScores([0, 0, 0, 0, 0]);

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        socket.emit('score', {scores});
    }, [scores])

    const handleStart = () => {
        alert(`Start round with ${imposters} imposters and results: ${results}`);
        socket.emit('start', {numPlayers: imposters, results});
        updateView();
    }

    const handleChangeImposters = (e) => {
        setImposters(e.target.value);
    }

    const handleChangeResults = (e) => {
        setResults(e.target.value);
    }

    const handleScoreChange = (e) => {
        e.preventDefault();
        const id = parseInt(e.target.name);
        const value = parseFloat(e.target[0].value);
        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }
        setScores(scores.map((score, index) => index === id ? score + value : score));
        
        e.target[0].value = '';
    }

    const updateView = (e) => {
        socket.emit('view', {numPlayers: imposters, participants, scores});
    }

    const showAnswer = (e) => {
        socket.emit('show_answer');
    }

    const showScore = (e) => {
        socket.emit('show_score');
    }

    return (
        <div>
            <h1>Controller Page</h1>
            <div className="flex flex-col gap-2 w-[30%] mx-auto">
                <input onChange={handleChangeImposters} type="text" placeholder="Number of imposters" />
                <input onChange={handleChangeResults} type="text" placeholder="Results" />
                <button onClick={handleStart}>Start round</button>
            </div>
            <div>
                {
                    participants.map((participant) => {
                        return (
                            <div key={participant.id}>
                                <p>{`${participant.name}: ${scores[participant.id]} pts`}</p>
                                <form name={participant.id} className="flex gap-2 justify-center" onSubmit={handleScoreChange}>
                                    <input type="number" step="0.5" />
                                    <button type="submit" name={participant.id}>Add</button>
                                </form>
                            </div>
                        )
                    })
                }
            </div>
            <div className="mt-4 flex gap-2 justify-center">
                <button onClick={() => {
                    socket.emit('score', {scores});
                }}>Update score</button>
                <button onClick={updateView}>
                    Update view
                </button>
                <button onClick={showAnswer}>
                    Show answer
                </button>
                <button onClick={showScore}>Show score</button>
            </div>
        </div>
    )
}