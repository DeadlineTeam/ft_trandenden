import axios from 'axios';
import { useEffect } from 'react';
import './RecentChats.css'
import React from 'react';

//{currentUserId, roomId, setCurrentChat, setTopBarData}: {currentUserId:any, roomId:number, setCurrentChat:any, setTopBarData:any}
const RecentChats = (props:any) => {
    const [other, setOther] = React.useState<any>([]);
    const [recentMessage, setRecentMessage] = React.useState("");


    const handleClick = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/message/${props.roomId}`, { withCredentials: true })
            const topBarObject = Object.defineProperties({}, {
                senderUserName: {
                  value: ((res.data).filter((r:any) => r.senderId !== props.currentUserId))[0].senderUserName,
                  writable: true
                },
                senderAvatar: {
                    value: ((res.data).filter((r:any) => r.senderId !== props.currentUserId))[0].senderAvatar,
                    writable: true
                }
              });

            props.setCurrentChat(res.data)
            props.setTopBarData(topBarObject);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        const getRoomMembers = async () => {
            try {
              const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/member/${props.roomId}/all`, {withCredentials:true})
              const tmp = ((res.data).filter((r:any) => r.userId !== props.currentUserId)).map(({user}:any) => ({user}))[0].user;
              const newObject = Object.fromEntries(Object.entries(tmp).filter(([key]) => key === 'id' || key === 'username' || key === 'avatar_url' || key === 'online' || key === 'inGame'));
              setOther(newObject);
            } catch (error) {
              console.error(error);
            }
        };
        getRoomMembers();
        const getRecentMessage = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/message/${props.roomId}`, {withCredentials:true})
                    // too display only the recent message received from the friend
                // ((res.data).filter((r:any) => r.senderId !== currentUserId)).slice(-1)[0].content
                setRecentMessage((res.data).slice(-1)[0].content)
            } catch (error) {
                console.error(error);
            }
         };
        getRecentMessage();
    }, []);

    return (
        <>
            { recentMessage !== "" ?
                <div className ="recentConversations" onClick={() => handleClick()}  >
                    <img className="recentConversationsImg" src={other.avatar_url} alt="Snake"/>
                    <div className="test">
                        <span className="recentConversationsName">{other.username}</span>
                        <p>{recentMessage}</p>
                    </div>
                </div>
                : <div></div>
            }
        </>
    )
}

export default RecentChats