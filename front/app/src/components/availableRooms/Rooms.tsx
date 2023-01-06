import './Rooms.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = ({roomId, roomName, setCurrentChat, setTopBarData}: {roomId:number, roomName:string, setCurrentChat:any, setTopBarData:any}) => {
    const navigate = useNavigate();
    const handleSettings = (e:any) => {
        navigate(`/Rooms?roomId=${roomId}`);
      }
    const handleClick = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/message/${roomId}`, { withCredentials: true })
            console.log("setCurrentChat from Room component")
            setCurrentChat(res.data)
            //setTopBarData();
            console.log(res.data)
            
        } catch (error) {
            console.error(error)
        }
    } 
    return (
        <div className="Room" onClick={() => handleClick()}>
            <div className="availableRoom">
                <div className="availableRoomImgContainer">
                    <img className="availableRoomImg" src={require(`../../meeting.png`)} alt="Snake" />
                </div>
                <span className="availableRoomName">
                    {roomName}
                </span>
                <button className="settingsButton" onClick={handleSettings}><img className="settingsImg" src={require('../../settings.png')} alt="" /></button>
            </div>
        </div>
    )
}

export default Room