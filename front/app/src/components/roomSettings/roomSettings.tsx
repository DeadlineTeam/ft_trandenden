import React from 'react'
import './roomSettings.css'
import SaveButton from '../createRoom/saveButton'
import CancelButton from '../createRoom/cancelButton'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

const RoomSettings = () => {
    const [friends, setFriends] = React.useState([]);
    const [roomMembers, setMembers] = React.useState([]);


    useEffect(() => {
        axios.get("/users.json").then((response) =>{
          setFriends(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      }, []);
    
      useEffect(() => {
        axios.get("/users.json").then((response) =>{
          setMembers(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      }, []);

    
    const navigate = useNavigate();
  const handleCancel = (e:any) => {
    navigate('/Chat');
  };
    return (
        <form className="container">
            <div className="child1">
                <div className="child1Title">Room Settings</div>
            </div>
            
            <div className="child2">
                <div className="child2Password">
                    Room Password 
                </div>
                <div className="child2PasswordField">
                    <input className="child2PasswordFieldInput" type="text" />
                </div>
            </div>

            <div className="membersWrapper">
                <div className="child3">
                    <p>Members </p>
                    <div className="membersWrapperElements1">
                        {roomMembers.map((member:any) => (
                            <div className="roomMembers" key={member.id}>
                                <img className="roomMembersImg" src={require(`../../${member.profilePicture}`)} alt="Snake"/>
                                <span className="roomMembersName">{member.username}</span>
                                <div className="optionsWrapper">
                                    <button><img src={require('../../moderator.png')} alt="" /></button>
                                    <button><img src={require('../../volume.png')} alt="" /></button>
                                    <button><img src={require('../../delete.png')} alt="" /></button>
                                </div>
                            </div>
                        ) )}
                    </div>
                </div>
                <div className="child4">
                    <p>Add Members </p>
                    <div className="membersWrapperElements">
                        {friends.map((friend:any) => (
                            <div className="user" key={friend.id}>
                                <img className="userImg" src={require(`../../${friend.profilePicture}`)} alt="Snake"/>
                                <span className="userName">{friend.username}</span>
                                <button><img src={require('../../addIcon.png')} alt="" /></button>
                            </div>
                        ) )}
                    </div>
                </div>
            </div>
            <div className="child5">
                <div className="child5Cancel">
                    <button className="btn" onClick={handleCancel}>
                        <p>Cancel</p>
                    </button>
                </div>
                <div className="child5Save">
                    <button className="btn">
                        <p>Save</p>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default RoomSettings