import { useState } from "react";

export default function UserInfo({name, id}) {

    return (
        <div classname="userInfo">
            <h1>{"Username: " + name}</h1>
            <h2>{"User ID: " + id}</h2>
        </div>
    )
}