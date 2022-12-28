import React from "react";
import './Rooms.css'

const Room = () => {
    return (
        <div className="Room">
            <div className="availableRoom">
                <div className="availableRoomImgContainer">
                    <img className="availableRoomImg" src={require('../../SolidSnake.png')} alt="Snake" />
                </div>
                <span className="availableRoomName">
                    RoomName 1
                </span>
            </div>
        </div>
    )
}

export default Room