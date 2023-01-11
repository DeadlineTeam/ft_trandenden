import './Rooms.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
//{roomId, roomName, setCurrentChat, setTopBarData}: {roomId:number, roomName:string, setCurrentChat:any, setTopBarData:any}
const Room = (props:any) => {
    const navigate = useNavigate();
    const handleSettings = (e:any) => {
        navigate(`/Rooms?roomId=${props.roomId}`);
      }
    const handleClick = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/message/${props.roomId}`, { withCredentials: true })
            const topBarObject = Object.defineProperties({}, {
                senderAvatar: {
                  value: `../../meeting.png`,
                  writable: true
                },
                senderUserName: {
                    value: props.roomName,
                    writable: true
                }
              });
            props.setCurrentChat(res.data)
            props.setTopBarData(topBarObject);
            
        } catch (error) {
            console.error(error)
        }
    } 
    return (
        <div className="Room" onClick={() => handleClick()}>
            <div className="availableRoom">
                <div className="availableRoomImgContainer">
                    <img   className="availableRoomImg" src={require(`../../meeting.png`)} alt="Snake" />
                </div>
                <span className="availableRoomName">
                    {props.roomName}
                </span>
                <button className="settingsButton" onClick={handleSettings}><img   className="settingsImg" src={require('../../settings.png')} alt="" /></button>
            </div>
        </div>
    )
}

export default Room