import React, { useEffect, useState } from 'react'
import './createRoom.css'
import SaveButton from './saveButton'
import CancelButton from './cancelButton'
import RoomNameField from './roomName'
import AccessMode from './accessMode'
import PasswordField from './passwordField'
import axios from "axios"
import {MdGroups} from 'react-icons/md';

import { AiOutlinePlusSquare } from 'react-icons/ai'
import { AiOutlineMinusSquare } from 'react-icons/ai'

import { toast } from 'react-toastify'


type CreateRoomProps = {
	handleCancel: () => void;
}

type FriendProps = {
	id: number;
	avatar_url: string;
	username: string;
	addToList: (id: number) => void;
	removeFromList: (id: number) => void;
}

const Friend = (props: FriendProps) => {
	const [added, setAdded] = useState(false);

	const addToList = () => {
		props.addToList(props.id);
		setAdded(true);
	}
	const removeFromList = () => {
		props.removeFromList(props.id);
		setAdded(false);
	}

	return (
		<div className="membeR" key={props.id}>
			<img className="membeRImg" src={props.avatar_url} alt="Snake"/>
			<span className="membeRName">{props.username}</span>
			{
				!added && <button className='addremobutt1' onClick={addToList}>
					<AiOutlinePlusSquare className='addremobutt'/>
				</button>
			}
			{
				added && <button className='addremobutt1'onClick={removeFromList}>
					<AiOutlineMinusSquare className='addremobutt'/>
				</button>
			}
	  	</div>
	)
}


type friendDto = {
	id: number;
	username: string;
	avatar_url: string;
	online: boolean;
	inGame: boolean;
}

const CreateRoom = (props: CreateRoomProps) => {
	const [roomName, setRoomName] = React.useState("");
	const [visibility, setAccessMode] = React.useState('Public');
	const [password, setPassword] = React.useState("");

	const [friends, setFriends] = useState <friendDto []> ([]);
	const [users, setUsers] = useState <number []> ([]);

	useEffect (() => {
		axios.get (`${process.env.REACT_APP_BACK_URL}/friend/all`, { withCredentials: true, })
		.then ((response) => {
			setFriends (response.data);
		}).catch (() => {})
	}, [])

	
	const AddToList = (id: number) => {
		setUsers (users => [...users, id]);
	}
	
	const RemoveFromList = (id: number) => {
		setUsers (users.filter (user => user !== id));
	}

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const formData = {
			name: roomName,
			visibility: visibility,
			password: password,
			users: users,
		};

    	axios.post(`${process.env.REACT_APP_BACK_URL}/room/create`, formData,  { withCredentials: true, })
    	.then((response) => {
			toast.success('Room created successfully');
			props.handleCancel();
			console.log(response);
    	})
    	.catch(e => {
    		toast.error(e.response.data.message);
    	});
		console.log(formData);
	};

    return (
		<form className="container">
		  	<div className="child1">
		  		<div className="child1Title">Create Room</div>
		  	</div>
		  	<div className="child2">
		  		<MdGroups className='roomicon'/>
		  	</div>
		  	<RoomNameField roomName={roomName} setRoomName={setRoomName}/>
		  	<AccessMode visibility={visibility} setAccessMode={setAccessMode}/>
		  	<PasswordField password={password} setPassword={setPassword} visibility={visibility}/>
		  	<div className="child6">
		  		<p>Add Admins :</p>
		  		<div className="child6SelectMembers">
					{
						friends.map (
							(friend: friendDto) => 
							<Friend 
								id={friend.id}
								key={friend.id}
								avatar_url={friend.avatar_url} 
								username={friend.username}
								addToList={AddToList}
								removeFromList={RemoveFromList}
							/>
						)
					}
		  		</div>
		  	</div>
		  	<div className="child7">
		  	  <CancelButton handleCancel={props.handleCancel}/>
		  	  <SaveButton handleSubmit={handleSubmit} />
		  	</div>
		</form>
    )
}

export default CreateRoom