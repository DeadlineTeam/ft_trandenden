import axios from 'axios'
import './Friends.css'


const Friends = (props:any) => {
    const handleClick = async () => {
        try {
            const concerned = (await axios.get(`${process.env.REACT_APP_BACK_URL}/room/myrooms`, { withCredentials: true })).data.filter((room: any) => room.visibility === 'DM').filter((concerned:any) => concerned.name === `DM-${props.currentUserId}-${props.id}` || concerned.name === `DM-${props.id}-${props.currentUserId}`)
            
            try {
                const res2 = await axios.get(`${process.env.REACT_APP_BACK_URL}/message/${concerned[0].id}`, { withCredentials: true })
                
                const topBarObject = Object.defineProperties({}, {
                    senderAvatar: {
                      value: props.profilePicture,
                      writable: true
                    },
                    senderUserName: {
                        value: props.username,
                        writable: true
                    }
                  });
                props.setCurrentChat(res2.data);
                props.setTopBarData(topBarObject);
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