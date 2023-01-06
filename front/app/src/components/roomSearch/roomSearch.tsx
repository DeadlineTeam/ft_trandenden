import React, { useEffect } from 'react';
import { useState } from 'react';
import './roomSearch.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import {MdGroups} from 'react-icons/md';
import {FaLock} from 'react-icons/fa';
import {TbArrowsJoin2} from 'react-icons/tb';
import {IoMdAddCircle} from 'react-icons/io';

type RoomSearchProps = {
	id: number;
	name: string;
	visibility: string;
	createDate: string;
	bg: number;
	refresh: () => void;
}

type SearchProps = {
	handleCreateRoom: () => void;
}




const Room = (props: RoomSearchProps) => {
	const [password, setPassword] = useState ('');

	const joinRoom = () => {
		axios.post (`http://localhost:3001/room/join/${props.id}`, {password: password}, { withCredentials: true })
		.then ( () => {
			toast.success (`successfully joined ${props.name}`)
			props.refresh ();
		}).catch (e => {
			toast.error (e.response.data.message)
		})
	}

	const getPassword = (e: any) => {
		setPassword (e.target.value);
	}

	return (
		<div className={props.bg === 0? "room0": "room1"}>
			<div>
				<p className='roomname'>{props.name}</p>
			</div> 
			{props.visibility === 'PROTECTED' &&  <FaLock className='publicicon'/>}
			{props.visibility === 'PUBLIC' && <MdGroups className='publicicon'/>}
			{props.visibility === 'PROTECTED' && <input  className ="inputprotected"placeholder="pass..." type="password" name="password" onChange={getPassword}/>}
			<div className="roomJoin">
				<button className = "butttton"onClick={joinRoom}><TbArrowsJoin2 className='joinbutt'/></button>
			</div>
		</div>

	)
}


const RoomSearch = (props: SearchProps) => {
	const [searchValue, setSearchValue] = useState('');
	const [rooms, setRooms] = useState<RoomSearchProps []> ();
	const [update, setUpdate] = useState (false);

	useEffect (() => {
		search ();
	}, [update, searchValue])

	const updateComp = () => {
		setUpdate (!update);
	}

	const search = () => {
		axios.get (`http://localhost:3001/room/search/${searchValue}`, { withCredentials: true })
		.then ( (res) => {
			setRooms (res.data);
		}).catch ( (e) => {
			setRooms ([])
		})
	}

	return (
		<div className="roomSearch">
			<div className="roomSearchBar">
				<input type="text" className='input'  placeholder= "search for a room" onChange={e => setSearchValue (e.target.value)}/>
				<div className="roomSearchCreateRoom">
					<button className='Buttoncreat' onClick={props.handleCreateRoom}>
						<IoMdAddCircle className='creatbutton'/>
						 </button>
				</div>
			</div>
				{rooms && rooms.map((room, index) => <Room {...room} key={index} bg={index % 2} refresh={updateComp}/> )}
		</div>

	)
}

export default RoomSearch