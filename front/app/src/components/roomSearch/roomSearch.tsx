import React, { useEffect } from 'react';
import { useState } from 'react';
import './roomSearch.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import {MdGroups} from 'react-icons/md';
import {FaLock} from 'react-icons/fa';
import {TbArrowsJoin2} from 'react-icons/tb';
import {IoMdAddCircle} from 'react-icons/io';

type RoomProps = {
	id				: number;
	name			: string;
	visibility		: string;
	member			: boolean;
	index			: boolean;
	refresh			: () => void;
}



const Room = (props: RoomProps) => {
	const [password, setPassword] = useState ('');


	const joinRoom = (allo:number) => {
		axios.post (`${process.env.REACT_APP_BACK_URL}/room/join/${props.id}`, {password: password}, { withCredentials: true })
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

		<div className={props.index? "room0": "room1"}>
			<div>
				<p className='roomname'>{props.name}</p>
			</div>
			{ props.visibility === 'PROTECTED' &&  <FaLock className='publicicon'/>}
			{ props.visibility === 'PUBLIC' && <MdGroups className='publicicon'/>}
			{ props.visibility === 'PROTECTED' && props.member == false && <input  className ="inputprotected" placeholder="pass..." type="password" name="password" onChange={getPassword}/>}
			{ props.member == false && (
				<div className="roomJoin">
					<button className = "butttton" onClick={()=>joinRoom(props.id)}><TbArrowsJoin2 className='joinbutt'/></button>
				</div>
			)}
		</div>

	)
}

type SearchProps = {
	handleCreateRoom: () => void;
}

const RoomSearch = (props: SearchProps) => {
	const [searchValue, setSearchValue] 		=	useState('');
	const [rooms, setRooms] 					=	useState<RoomProps []> ([]);
	const [filteredRooms, setFilteredRooms] 	=	useState<RoomProps []> ([]);
	const [update, setUpdate] = useState (false);

	const loadRooms = () => {
		axios.get(`${process.env.REACT_APP_BACK_URL}/room/available`, {withCredentials :true})
		.then((response) => {
			setRooms ([]);
			setFilteredRooms ([]);
			response.data.forEach ((room: any, index: number) => {
				setRooms (prev => [...prev, room]);
				setFilteredRooms (prev => [...prev, room]);
			})
		})
	}


	useEffect (() => {
		loadRooms ();
		setSearchValue ('');
	}, [update])
	
	useEffect (() => {
		if (searchValue !== '')
			setFilteredRooms (rooms.filter (room => room.name.toLowerCase ().includes (searchValue.toLowerCase ())));
		else
			setFilteredRooms (rooms);	
	}, [searchValue])


	const updateComp = () => {
		setUpdate (!update);
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
			<>
			{
				filteredRooms.map ((room, index) => <Room {...room} refresh={updateComp} index={index%2 == 0} key={index}/> )
			}
			</>	
		</div>

	)
}

export default RoomSearch