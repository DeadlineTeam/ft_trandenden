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
	roomid: number;
	name: string;
	visibility: string;
	createDate: string;
	bg: number;
	refresh: () => void;
}

type SearchProps = {
	handleCreateRoom: () => void;
}




const Room = () => {
	const [password, setPassword] = useState ('');
	const [availablerooms, setAvailablerooms] = useState(Array<any>());
	useEffect(()=>{
		axios.get('http://localhost:3001/room/available', {withCredentials :true})
		.then((response)=>{
			console.log(response.data);
			setAvailablerooms(response.data);
		})
	})
	const po="Sadasdsa";
	const joinRoom = (allo:number) => {
		axios.post (`http://localhost:3001/room/join/${allo}`, {password: password}, { withCredentials: true })
		.then ( () => {
			toast.success (`successfully joined ${allo}`)
			//props.refresh ();
		}).catch (e => {
			toast.error (e.response.data.message)
		})
	}

	const getPassword = (e: any) => {
		setPassword (e.target.value);
	}

	return (
		<div>
			{
				availablerooms.map((value, index)=>{
					return(
						<div className={index%2 === 0? "room0": "room1"}>
						<div>
							<p className='roomname'>{value.roomname}</p>
						</div> 
						{value.roomvisibility === 'PROTECTED' &&  <FaLock className='publicicon'/>}
						{value.roomvisibility === 'PUBLIC' && <MdGroups className='publicicon'/>}
						{value.roomvisibility === 'PROTECTED' && value.notMembers == false && <input  className ="inputprotected"placeholder="pass..." type="password" name="password" onChange={getPassword}/>}
						{value.notMembers == false &&(
						<div className="roomJoin">
							<button className = "butttton" onClick={()=>joinRoom(value.id)}><TbArrowsJoin2 className='joinbutt'/></button>
						</div>)
						}
					</div>
					)
				})
			}
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
				<Room/>
		</div>

	)
}

export default RoomSearch