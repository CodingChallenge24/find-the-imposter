import { useState, useEffect } from "react";
import UserBar from "./UserBar"
import { socket } from "./socket.js";
import peopleBlack from './assets/peopleBlack.png'
import peopleGreen from './assets/peopleGreen.png'
import logo from './assets/logo.png'
import Timer from "./Timer.jsx";

export default function ViewerPage() {
    const [userList, setUserList] = useState([])
    const [numPlayers, setNumPlayers] = useState(0)
    const [answer, setAnswer] = useState("")
    const [time, setTime] = useState(0)
    useEffect(() => {
        socket.connect();
        socket.on('update_view', (data) => {
            let playerList = []
            console.log(data)
            setNumPlayers(parseInt(data.numPlayers))
            setTime(300)
            setUserList([])
            setAnswer([])
            data.participants.forEach(participant => {
                playerList.push(<UserBar participant={participant} noImposter={data.numPlayers}/>)
            });
            setUserList(playerList)
        })

        socket.on('show_answer', (data) => {
            console.log(data);
            const pos = data.imposterPositions;
            const tmp = []
            for (let i = 0; i < numPlayers; i++) {
                tmp.push(<img className="w-[50px]" key={i} src={pos.indexOf(i + 1) !== -1 ? peopleGreen : peopleBlack} alt={i} />)   
            }
            setAnswer(tmp)
        })

        return () => {
            socket.off('update_view');
            socket.off('show_answer');
            socket.disconnect();
        }
        // alert("23423iuser4234234")
    }, [numPlayers, answer, userList])

    return (
        <>
            <img className="mx-auto" src={logo} />
            { time > 0 && <Timer time={time} setTime={setTime}/> }
            <div className="flex flex-col gap-4">
                {userList}
            </div>
            <div className="grid grid-cols-4 items-center mt-8">
                <p className="text-lg font-bold">Answer</p>
                <div className='col-span-2 flex flex-wrap justify-center'>
                    {answer}
                </div>
            </div>
        </>
    )
}