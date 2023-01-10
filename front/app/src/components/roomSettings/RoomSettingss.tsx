import React, { useEffect, useState } from 'react'
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

interface props{
  close :  React.Dispatch<React.SetStateAction<boolean>>;
}


type FriendProps = {
	id: number;
	avatar_url: string;
	username: string;

}

type friendDto = {
	id: number;
	username: string;
	avatar_url: string;
	online: boolean;
	inGame: boolean;
}

const Friend1 = (props: FriendProps) => {
	const [mute , setMute] = useState(false);
	const [ban , setBan] = useState(false);
	const [owner , setOwner] = useState(false);
	const [admin, setAdmin] = useState(false)
	const handlemute = () =>{

		setMute(true);
	}
	return (
		<div className="membeR" key={props.id}>
			<img className="membeRImg" src={props.avatar_url} alt="Snake"/>
			<span className="membeRName">{props.username}</span>
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
			{owner == false && (	
			 <button className='addremobutt1'>
					<BsFillTrashFill className='addremobutt'/>
			</button>
			)}
			
			{
				!mute && owner == false &&  <button className='addremobutt1' >
					<BsFillVolumeMuteFill onClick={handlemute} className='addremobutt'/>
				</button>
			}
			{
				mute && owner == false && <button className='addremobutt1'>
					<GoUnmute className='addremobutt'/>
				</button>
			}
			{
				!ban && owner == false && <button className='addremobutt1' >
					<BiBlock className='addremobutt'/>
				</button>
			}
			{
				ban &&owner == false && <button className='addremobutt1'>
					<CgUnblock className='addremobutt'/>
				</button>
			}
	  	</div>
	)
}

const RoomSettingss = ({close} : props) => {
  const [friends, setFriends] = useState <friendDto []> ([]);
  useEffect (() => {
		axios.get ('http://localhost:3001/friend/all', { withCredentials: true, })
		.then ((response) => {
			setFriends (response.data);
		}).catch (() => {})
	}, [])
	const handleexit = () => {
		close(false)
	}

  
  return (
	<div className='RoomSettingss1'>
		<div className='RoomSettingss'>
			<h1 className='settititle'>Room Settings</h1>
			<button className='exit' onClick={handleexit}> <MdOutlineClose className='exiticon'/></button>
    	  <div className='child6SelectMembers2'>
						{
							friends.map (
								(friend: friendDto) => 
								<Friend1
									id={friend.id}
									key={friend.id}
									avatar_url={friend.avatar_url} 
									username={friend.username}

								/>
							)
						}
			  		</div>
		</div>
	</div>
  )
}

export default RoomSettingss