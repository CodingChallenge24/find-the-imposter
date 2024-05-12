import { useEffect, useState } from "react"
import { socket } from "./socket.js"

export default function ControllerPage() {
    const [imposters, setImposters] = useState(0);
    const [results, setResults] = useState("");
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role !== 'controller') {
            window.location.href = '/';
        }
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, [])

    const handleStart = () => {
        alert(`Start round with ${imposters} imposters and results: ${results}`);
        socket.emit('start', {imposters, results});
    }

    const handleChangeImposters = (e) => {
        setImposters(e.target.value);
    }

    const handleChangeResults = (e) => {
        setResults(e.target.value);
    }

    return (
        <div>
            <h1>Controller Page</h1>
            <div className="flex flex-col gap-2">
                <input onChange={handleChangeImposters} type="text" placeholder="Number of imposters" />
                <input onChange={handleChangeResults} type="text" placeholder="Results" />
                <button onClick={handleStart}>Start round</button>
            </div>
        </div>
    )
}