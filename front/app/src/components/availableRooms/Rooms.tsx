import React from "react";
import './Rooms.css'
import { useNavigate } from "react-router-dom";

const Room = ({id, roomname, roomPicture}: {id:number, roomname:string, roomPicture:string}) => {
    const navigate = useNavigate();
    const handleSettings = (e:any) => {
        navigate(`/Rooms?roomId=${id}`);
      }
    return (
        <div className="Room">
            <div className="availableRoom">
                <div className="availableRoomImgContainer">
                    <img className="availableRoomImg" src={require(`../../${roomPicture}`)} alt="Snake" />
                </div>
                <span className="availableRoomName">
                    {roomname}
                </span>
                <button className="settingsButton" onClick={handleSettings}><img className="settingsImg" src={require('../../settings.png')} alt="" /></button>
            </div>
        </div>
    )
}

export default Room