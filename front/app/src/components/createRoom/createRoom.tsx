import React, { useEffect } from 'react'
import './createRoom.css'
import SaveButton from './saveButton'
import CancelButton from './cancelButton'
import RoomNameField from './roomName'
import AccessMode from './accessMode'
import PasswordField from './passwordField'
import axios from "axios"
import {useNavigate} from 'react-router-dom'


const CreateRoom = () => {
  const [roomName, setRoomName] = React.useState("");
  const [visibility, setAccessMode] = React.useState('Public');
  const [password, setPassword] = React.useState("");
  const [friends, setFriends] = React.useState([]);
  

  useEffect(() => {
    axios.get("/friend/all").then((response) => {
      setFriends(response.data);
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


  const formIsFilled = () => {
    if (visibility === 'Protected') {
      return roomName !== '' && password !== '';
    }
    return roomName !== '';
  }
  const handleSubmit = (e:any) => {
    e.preventDefault();
    const formData = {
      roomName: roomName,
      visibility: visibility,
      password: password,
      friends: friends
    };



    console.log(formData)
    axios.post('/room/create', formData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };
    return (
      <form className="container">
        <div className="child1">
          <div className="child1Title">Create Room</div>
        </div>
        <div className="child2">
          <img src={require('../../SolidSnake.png')} alt="" />
        </div>
        <RoomNameField roomName={roomName} setRoomName={setRoomName}/>
        <AccessMode visibility={visibility} setAccessMode={setAccessMode}/>
        <PasswordField password={password} setPassword={setPassword} visibility={visibility}/>
        <div className="child6">
          <p>Add Members :</p>
          <div className="child6SelectMembers">
            {friends.map((friend:any) => (
              <div className="member" key={friend.id}>
                <img className="memberImg" src={friend.profilePicture} alt="Snake"/>
                <span className="memberName">{friend.username}</span>
                <button><img src={require('../../addIcon.png')} alt="" /></button>
              </div>
            ) )}
          </div>
        </div>
        <div className="child7">
          <CancelButton handleCancel={handleCancel}/>
          <SaveButton handleSubmit={handleSubmit} formIsFilled={formIsFilled}/>
        </div>
      </form>
    )
}

export default CreateRoom