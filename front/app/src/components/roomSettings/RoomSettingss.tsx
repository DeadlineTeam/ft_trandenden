import React, { useContext, useEffect, useState } from 'react'
import "./roomSettings.css"
import axios from "axios"
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { AiOutlineMinusSquare } from 'react-icons/ai'
import {BsFillVolumeMuteFill} from 'react-icons/bs'
import {GoUnmute} from 'react-icons/go'
import {TbCrown} from 'react-icons/tb'
import {BiBlock} from 'react-icons/bi'
import {CgUnblock} from 'react-icons/cg'
import {MdOutlineClose} from 'react-icons/md'
import {BsFillTrashFill} from 'react-icons/bs'
import {RiAdminFill} from 'react-icons/ri'
import { UserContext } from '../ProtectedLayout'


type UserDto = {
	id				: number;
	username		: string;
	avatar_url		: string;
}

type memberDto = {
	id				:	number;
	roomId			:	number;
	role			:	string;
	muted			:	boolean;
	muteTime		:	number;
	banned			:	boolean;
	user			:	UserDto;
}

const Member = (props: memberDto) => {
	const [mute , setMute]		= useState(props.muted);
	const [ban , setBan] 		= useState(props.banned);
	const [owner , setOwner]	= useState(props.role === 'OWNER');
	const [admin, setAdmin]		= useState(props.role === 'ADMIN')
	
	const handlemute = () =>{
		axios.post (`http://localhost:3001/member/${props.roomId}/${props.user.id}/${mute ? 'unmute': 'mute'}`, {}, { withCredentials: true, })
		.then ((response) => {
		}).catch ((e) => {
		})
		setMute((mute) => !mute);
	}

	const handleBan = () => {
		axios.post (`http://localhost:3001/member/${props.roomId}/${props.user.id}/${ban ? 'unban': 'ban'}`, {}, { withCredentials: true, })
		.then ((response) => {

		}).catch ((e) => {

		})
		setBan ((ban) => !ban)
	}

	const handleKick = () => {
		axios.delete (`http://localhost:3001/member/${props.roomId}/${props.user.id}/delete`, { withCredentials: true, })
		.then ((response) => {
			console.log ("deleted")
		}).catch ((e) => {
			console.log (e);
		})
	}


	return (
		<div className="membeR" key={props.id}>
			<img className="membeRImg" src={props.user.avatar_url} alt="member"/>
			<span className="membeRName">{props.user.username}</span>
			{
				owner && <button className='addremobutt1' >
					<TbCrown className='addremobutt'/>
				</button>
			}
			{
				admin && <button className='addremobutt1' >
					<RiAdminFill className='addremobutt'/>
				</button>
			}
			{
				!owner && 	
				<button className='addremobutt1'>
					<BsFillTrashFill onClick={handleKick} className='addremobutt'/>
				</button>
			}
			
			{
				(!mute && owner == false &&  <button className='addremobutt1' >
					<BsFillVolumeMuteFill onClick={handlemute} className='addremobutt'/>
				</button>)
			}
			{
				mute && owner == false && <button className='addremobutt1'>
					<GoUnmute onClick={handlemute} className='addremobutt'/>
				</button>
			}
			{
				!ban && owner == false && <button className='addremobutt1' >
					<BiBlock onClick={handleBan} className='addremobutt'/>
				</button>
			}
			{
				ban &&owner == false && <button className='addremobutt1'>
					<CgUnblock onClick={handleBan} className='addremobutt'/>
				</button>
			}
	  	</div>
	)
}


interface RoomSettingsProps{
  close		:	React.Dispatch<React.SetStateAction<boolean>>;
  id		:	number;
}

const RoomSettingss = (props : RoomSettingsProps) => {
	const [members, setMembers] = useState <memberDto []> ([]);
	const user					= useContext (UserContext)
	
	useEffect (() => {
		axios.get (`http://localhost:3001/member/${props.id}/all`, { withCredentials: true, })
		.then ((response) => {
			response.data.forEach ((member: memberDto) => {
				setMembers (members => [...members, member])
			})
		}).catch (() => {

		})
	}, [])
	
	
	const handleexit = () => {
		props.close(false)
	}

  
  return (
	<div className='RoomSettingss1'>
		<div className='RoomSettingss'>
			<h1 className='settititle'>Room Settings</h1>
			<button className='exit' onClick={handleexit}> <MdOutlineClose className='exiticon'/></button>
    		<div className='child6SelectMembers2'>
				{
					members.map ((member) => {
						if (member.user.id !== user?.user.id )
							return <Member {...member} key={member.id}/>
					})
				}		
			</div>
		</div>
	</div>
  )
}

export default RoomSettingss