import React from 'react'
import './Chat.css'
import '../components/recentChats/RecentChats'
import RecentChats from '../components/recentChats/RecentChats'
import Message from '../components/chatZone/ChatZone'
import Friends from '../components/onlineFriends/Friends'
import Room from '../components/availableRooms/Rooms'

const Chat = () => {
  return (
      <div className="chatApp">
        {/* recent Messages Start */}
        <div className="recentMessages">
          <div className="recentMessagesWrapper">
            <div className="recentMessagesTitle">
              Messages
            </div>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
            <RecentChats/>
          </div>  
        </div>
        {/* recent Messages End */}
        
        {/* chat Zone Start */}
        <div className="chatZone">
          <div className="chatZoneWrapper">
            <div className="chatZoneTop">
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message own={true}/>
              <Message own={true}/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message own={true}/>
              <Message own={true}/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message/>
              <Message own={true}/>
              <Message/>
              <Message own={true}/>
              <Message/>

            </div>
            <div className="chatZoneBottom">
              <textarea className="chatZoneInput" placeholder="write a text...." ></textarea>
              <button className="chatZoneSubmitButton">Send</button>
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
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>
              <Friends/>

            </div>
          </div>
          <div className="availableRooms">
            <div className="availableRoomsTitle">
              Rooms
            </div>
            <div className="availableRoomsWrapper">
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              <Room/>
              
            </div>
          </div>
        </div>
        {/* Online friends end */}
      </div>

  )
}

export default Chat