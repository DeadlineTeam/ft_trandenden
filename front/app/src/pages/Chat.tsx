import React, { useContext } from 'react'
import './Chat.css'
import '../components/recentChats/RecentChats'
import RecentChats from '../components/recentChats/RecentChats'
import Message from '../components/chatZone/ChatZone'
import Friends from '../components/onlineFriends/Friends'
import Room from '../components/availableRooms/Rooms'
import { useEffect } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import TopBar from '../components/chatZone/topBar'
import { chatSocketContext } from '../contexts/socket'



const Chat = () => {
  const [currentUserId, setCurrentUserId] = React.useState('');
  const [currentUsername, setCurrentUsername] = React.useState('');
  const [friends, setFriends] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [dmRooms, setdmRooms] = React.useState([]);
  const [currentChat, setCurrentChat] = React.useState([]);
  const [topBarData, setTopBarData] = React.useState([]);

  
  const socket = useContext(chatSocketContext);

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users/id", {withCredentials: true});
        setCurrentUserId(res.data)
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentUserId();
    
    const getCurrentUsername = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users/username", {withCredentials: true});
        setCurrentUsername(res.data)
      } catch (error) {
        console.error(error);
      }
    };
    getCurrentUsername();
    
    const getFriends = async () => {
      try {
        const res = await axios.get("http://localhost:3001/friend/all", {withCredentials:true});
        setFriends(res.data);
      } catch (error) {
        console.error(error)
      }
    };
    getFriends();
    
    const getRooms = async () => {
      try {
        const res = await axios.get("http://localhost:3001/room/myrooms", { withCredentials: true });
        setRooms((res.data).filter((r:any) => r.visibility !== 'DM'));
        setdmRooms((res.data).filter((r:any) => r.visibility === 'DM'))
      } catch (error) {
        console.error(error);
      }
    };
    getRooms();

  }, [])

  const navigate = useNavigate();
  const handleUserProfile = (e:any) => {
    navigate('/Myprofile');
  }
  return (
      <div className="chatApp">
        {/* recent Messages Start */}
        <div className="recentMessages">
          <div className="recentMessagesWrapper">
            <div className="recentMessagesTitle">
              Messages
            </div>
            <div >
              { dmRooms.map((recentChat: any) => <RecentChats currentUserId={currentUserId}  roomId={recentChat.id}  setCurrentChat={setCurrentChat} setTopBarData={setTopBarData}  />  )}
            </div>
          </div>  
        </div>
        {/* recent Messages End */}
        
        {/* chat Zone Start */}
        <div className="chatZone">
          <div className="chatZoneWrapper">
              <TopBar data={topBarData} />
              <div className="chatZoneTop">
                { currentChat.map((message:any) => (<Message own={message.senderUserName === currentUsername} message={message}/> ))}
              </div>
              <div className="chatZoneBottom">
                <textarea className="chatZoneInput" placeholder="write a text...." ></textarea>
                <button className="chatZoneSubmitButton"><img className="chatZoneSubmitButtonImg" src={require(`../send.png`)} alt="send" /></button>
              </div>
          </div>
        </div>
        {/* chat Zone End */}

        {/* Online friends start */}
        <div className="onlineFriendsAndRooms">
          <div className="onlineFriends">
            <div className="onlineFriendsTitle">
              Friends
            </div>
            <div className="onlineFriendsWrapper">
              { friends.map((friend:any) => (<Friends id={friend.id} username={friend.username} profilePicture={friend.avatar_url} handleUserProfile={handleUserProfile} currentUserId={currentUserId} setCurrentChat={setCurrentChat} setTopBarData={setTopBarData}  /> ))}
            </div>
          </div>
          <div className="availableRooms">
            <div className="availableRoomsTitle">
              Rooms
            </div>
            <div className="availableRoomsWrapper">
              { rooms.map((room: any) => <Room roomId={room.id} roomName={room.name} setCurrentChat={setCurrentChat} setTopBarData={setTopBarData} /> )}
            </div>
          </div>
        </div>
        {/* Online friends end */}
      </div>

  )
}

export default Chat