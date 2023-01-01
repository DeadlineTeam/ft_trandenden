import React from 'react'
import './Chat.css'
import '../components/recentChats/RecentChats'
import RecentChats from '../components/recentChats/RecentChats'
import Message from '../components/chatZone/ChatZone'
import Friends from '../components/onlineFriends/Friends'
import Room from '../components/availableRooms/Rooms'
import { useEffect } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../components/ProtectedLayout'
import { useRef } from 'react'

const Chat = () => {
  const [rooms, setRooms] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const user = useContext(UserContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const handleUserProfile = (e:any) => {
    navigate('/Myprofile');
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // messages
  
  
  // Online Friends
  useEffect(() => {
    axios.get("/users.json").then((response) =>{
      setFriends(response.data);
      console.log("Online Friends")
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  // available Rooms
  useEffect(() => {
    axios.get("/rooooms.json").then((response) =>{
      setRooms(response.data); 
      console.log("Available Rooms")
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);
  return (
      <div className="chatApp">
        {/* recent Messages Start */}
        <div className="recentMessages">
          <div className="recentMessagesWrapper">
            <div className="recentMessagesTitle">
              Messages
            </div>
            <div >
                <RecentChats />
                <RecentChats/>
                <RecentChats/>
                <RecentChats/>
            </div>
          </div>  
        </div>
        {/* recent Messages End */}
        
        {/* chat Zone Start */}
        <div className="chatZone">
          <div className="chatZoneWrapper">
            
              <div className="chatZoneTop">
                <Message own={true}/> 
                <Message /> 
                <Message own={true}/> 
                <Message own={true}/>  

              </div>
              <div className="chatZoneBottom">
                <textarea className="chatZoneInput" placeholder="write a text...." ></textarea>
                <button onClick={handleSubmit} className="chatZoneSubmitButton">Send</button>
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
              {friends.map((friend:any) => (
                <Friends id={friend.id} username={friend.username} profilePicture={friend.profilePicture} handleUserProfile={handleUserProfile}/>
              ) )}
            </div>
          </div>
          <div className="availableRooms">
            <div className="availableRoomsTitle">
              Rooms
            </div>
            <div className="availableRoomsWrapper">
              {rooms.map((room:any) => (
                <Room id={room.id} roomname={room.roomname} roomPicture={room.roomPicture} />
              ) )}
              
            </div>
          </div>
        </div>
        {/* Online friends end */}
      </div>

  )
}

export default Chat