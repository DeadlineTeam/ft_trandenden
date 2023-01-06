import axios from 'axios'
import './Friends.css'


const Friends = (props:any) => {
    const handleClick = async () => {
        try {
            const concerned = (await axios.get(`http://localhost:3001/room/myrooms`, { withCredentials: true })).data.filter((room: any) => room.visibility === 'DM').filter((concerned:any) => concerned.name === `DM-${props.currentUserId}-${props.id}` || concerned.name === `DM-${props.id}-${props.currentUserId}`)
            try {
                const res2 = await axios.get(`http://localhost:3001/message/${concerned[0].id}`, { withCredentials: true })
                console.log("setCurrentChat from Friends component")
                props.setCurrentChat(res2.data);
                //props.setTopBarData();
                //console.log()
            }
            catch (error) {
                console.error(error)
            };
        } catch (error) {
            console.error(error)
        };
    } 
    return (
        <div className="friends" >
            <div className="onlineFriend" key={props.id} onClick={() => handleClick()}>
                <div className="onlineFriendImgContainer">
                    <img className="onlineFriendImg" src={props.profilePicture} alt="Snake" />
                    {/* Add class onfflineFriendDot if deconnected */}
                    <div className="onlineFriendDot"></div> 
                </div>
                <span className="onlineFriendName">
                    {props.username}
                </span>
                <button className="settingsButton" onClick={props.handleUserProfile}><img className="settingsImg" src={require('../../userProfile.png')} alt="" /></button>
            </div>
        </div> 
    )
}

export default Friends