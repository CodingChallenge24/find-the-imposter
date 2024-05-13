import { useState, useEffect } from "react";
import UserBar from "./UserBar"
import { socket } from "./socket.js";

export default function ViewerPage({time}) {

    const [userList, setUserList] = useState([])
    useEffect(() => {
        socket.on('online', (data) => {
            let playerList = []
            console.log(data.userList)
            data.userList.forEach(element => {
                playerList.push(<UserBar userName={element} noImposter={30}/>)
            });
            setUserList(playerList)
        })

        return ()=>{
            socket.off('online');
        }
        // alert("23423iuser4234234")
    }, [userList])

    return (
        <>
            {userList}
        </>
    )
}