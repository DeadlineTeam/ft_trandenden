import React from 'react'
import './createRoom.css'

const RoomNameField = ({roomName, setRoomName}:any) => {
    return (
        <div className="child3">
          <p>Room Name :</p>
          <input className="inputFieldRoomName" type="text" id="roomName" value={roomName} onChange={(e) => setRoomName(e.target.value)}/>
        </div>
    )
}

export default RoomNameField