import React from 'react'
import './ChatZone.css'

const Message = ({own}:any) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={require('../../SolidSnake.png')} alt="Snake" />
                <p className="messageText">
                    Hostile coming from North
                </p>
            </div>
            <div className="messageBottom">
                1 hour ago
            </div>

        </div>
    )
}

export default Message