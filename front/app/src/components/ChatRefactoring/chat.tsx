import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { chatSocketContext } from '../../contexts/socket';
import { onlineSocketContext } from '../../contexts/socket';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import	{ GiGamepad } from 'react-icons/gi'
import { HiStatusOffline, HiStatusOnline } from 'react-icons/hi';
import { IoSettingsSharp } from 'react-icons/io5'
import  { FaLock } from 'react-icons/fa'
import { MdGroups } from 'react-icons/md';
import { GiPrivate } from 'react-icons/gi';
import RoomSettingss from '../roomSettings/RoomSettingss'
import { UserContext } from '../ProtectedLayout';

import '../../pages/Chat.css';
import '../availableRooms/Rooms.css';
import '../onlineFriends/Friends.css';
import {GiExitDoor} from 'react-icons/gi';
import '../chatZone/ChatZone.css';
import '../recentChats/RecentChats.css';

type UserId = {
	id: number;
}

const OnlineStatus = (props: UserId) => {
	const onlineSocket = useContext(onlineSocketContext);
	const [online, setOnline] = useState (false);

	useEffect (() => {
		axios.get(`http://localhost:3001/users/${props.id}/online`, {withCredentials: true}).
		then (res => {
			setOnline (res.data.online);
		}).catch ((e) => {
			setOnline(false);
		})
	}, [props.id])

	useEffect(() => {
		onlineSocket.on ('online', (id) => {
			if (id == props.id) {
				setOnline(true);
			}
		})
		onlineSocket.on ('offline', (id) => {
			if (id == props.id) {
				setOnline(false);
			}
		})

		return () => {
			onlineSocket.off('online');
			onlineSocket.off('offline');
		}
	}, [props.id])

	return (
		<div>
			{online ? <HiStatusOnline className='gameicon'/> : <HiStatusOffline className='gameicon'/>}
		</div>
	)
}

const GameInvite = (props: UserId) => {
	const [inGame, setInGame] = useState (false);
	const [online, setOnline] = useState (false);
	const onlineSocket = useContext(onlineSocketContext);
	const [show, setShow] = useState (false);
	const navigate = useNavigate();

	const inviteToGame = () => {
		const url = `http://localhost:3001/game/invite/${props.id}`
		axios.post(url, {} ,{withCredentials: true}).then((response) =>{
			navigate(`/Game?invite=${response.data.gameId}`)
		}).catch ((error) => {
			toast (error.response.data.message)
		})
	}

	useEffect (() => {
		if (online && !inGame) {
			setShow(true);
		}
		else {
			setShow(false);
		}
	})

	useEffect(() => {
		axios.get(`http://localhost:3001/users/${props.id}/online`, {withCredentials: true}).
		then (res => {
			if (res.data) {
				setOnline(res.data.online);
				setInGame(res.data.inGame);
			}
		}).catch ((e) => {
			setOnline(false);
			setInGame(false);
		})
		
		onlineSocket.on ('online', (id) => {
			if (id == props.id) {
				setOnline(true);
			}
		})

		onlineSocket.on ('offline', (id) => {
			if (id == props.id) {
				setOnline(false);
			}
		})

		onlineSocket.on ('inGame', (id) => {
			if (id == props.id) {
				setInGame(true);
			}
		})

		onlineSocket.on ('offGame', (id) => {
			if (id == props.id) {
				setInGame(false);
			}
		})

		return () => {
			onlineSocket.off("online");
			onlineSocket.off("offline");
			onlineSocket.off("inGame");
			onlineSocket.off("offGame");
		}
	}, [props.id])

	return (
		<div>
			{show ? <button className='gamebutton' onClick={inviteToGame}><GiGamepad className='gameicon'/></button> : null}
		</div>
	)

}

type FriendProps = {
	avatar: string;
	name: string;
	id: number;
	setChatZoneId: (id: number) => void;
}

const Friend = (props: FriendProps) => {
	const navigate = useNavigate();

	const ToProfile = () => {
		navigate(`/profile/${props.name}`)
	}

	const SetChatZoneId = () => {
		props.setChatZoneId(props.id);
	}

	useEffect (() => {

	}, [props.id])

	return (
		<div className="friends">
			<div className="onlineFriend" onClick={SetChatZoneId}>
				<div className="onlineFriendImgContainer">
					<img className="onlineFriendImg" onClick={ToProfile} src={props.avatar}/>
				</div>
				<span className="onlineFriendName">
					{props.name}
				</span>
			</div>
		</div>
	)
}

const FriendZone = (props: AvatarToConvoPointers) => {
	const [friends, setFriends] = useState<FriendProps []> ([]);

	useEffect (() => {
		setFriends ([])
		props.RoomIdToMsgs.forEach ((convo, id) => {
			if (convo.visibility === 'DM') {
				const friend: FriendProps = {
					avatar			: convo.avatar,
					name			: convo.name,
					id				: convo.roomId,
					setChatZoneId	: props.setChatZoneId
				}
				setFriends ((prev) => [...prev, friend])
			}
		})

	}, [props.done, props.RoomIdToMsgs])

	return (
		<div className="onlineFriends">
			<div className="onlineFriendsTitle">
				Friends
			</div>
			<div className="onlineFriendsWrapper">
				{friends.map((friend) => <Friend {...friend} key={friend.id}/>)}
			</div>
		</div>
	)
}

type RoomProps = {
	id: number;
	name: string;
	visibility: string;
	setChatZoneId: (id: number) => void;
}

const Room = (props: RoomProps) => {
	const [open , seTopen] = useState(false)
	const LeaveRoom = () => {
		axios.post (`http://localhost:3001/room/${props.id}/leave`, {}, {withCredentials: true})
		.then ((res) => {
			toast ('you left the room')
		}).catch ((e) => {
			toast ('you could not leave the room')
		})
	}

	const RoomSettings1 = ()=>{
		seTopen(true);
	}
	const RoomSettings = () => {
		
	}

	const setChatZoneId = () => {
		props.setChatZoneId(props.id);
	}

	return (
		<div className="Room" onClick={setChatZoneId}>
			<div className="availableRoom">
				<div className="availableRoomImgContainer">
					{props.visibility === 'PROTECTED'? <FaLock className="availableRoomImg"/>: props.visibility === 'PUBLIC'? <MdGroups className="availableRoomImg"/>: <GiPrivate className="availableRoomImg"/>}
				</div>
				<span className="availableRoomName">
					{props.name}
				</span>
				<button onClick={RoomSettings1}> <IoSettingsSharp/></button>
				{open == true && (
					<RoomSettingss close= {seTopen}/>
					)
				}
				<button onClick={LeaveRoom}><GiExitDoor className="settingsButton"/></button>
			</div>
		</div>
	)
}

type AvatarToConvoPointers = {
	RoomIdToMsgs: Map<number, Conversation>;
	setChatZoneId: (id: number) => void;
	done: Boolean;
}

const RoomZone = (props: AvatarToConvoPointers) => {
	const [ rooms, setRooms ] = useState<RoomProps []> ([]);

	useEffect (() => {
		setRooms ([])
		props.RoomIdToMsgs.forEach ((convo, id) => {
			if (convo.visibility !== 'DM') {
				const room: RoomProps = {
					id: convo.id,
					name: convo.name,
					visibility: convo.visibility,
					setChatZoneId: props.setChatZoneId
				}
				setRooms ((prev) => [...prev, room])
			}
		})
	}, [props.done, props.RoomIdToMsgs])

	return  (
		<div className="availableRooms">
			<div className="availableRoomsTitle">
				Rooms
			</div>
			<div className="availableRoomsWrapper">
				{rooms.map((room) => <Room {...room} key={room.id}/>)}
			</div>
		</div>
	)
}

type FriendInfoProps = {
	avatar: string;
	name: string;
	id: number;
}

const FriendInfo = (props: FriendInfoProps) => {
	const navigate = useNavigate();

	const ToProfile = () => {
		navigate(`/profile/${props.name}`)
	}

	return (
		<>
			<div className='roomfriendinfo'>
				<img className='chatimg' onClick={ToProfile} src={props.avatar}/>
				<p className='friendroomusername'>{props.name}</p>
					<OnlineStatus id={props.id}/>
					<GameInvite id={props.id}/>
			</div>
			<hr className='usernameline'></hr>
		</>
	)
}

type RoomInfoProps = {
	name: string;
	visibility: string;
}

const RoomInfo = (props: RoomInfoProps) => {
	return (
		<>
			<div className='roomfriendinfo'>
				{props.visibility === 'PROTECTED'? <FaLock className='chatimg' />: props.visibility === 'PUBLIC'? <MdGroups className='chatimg' />: <GiPrivate className='chatimg'/>}
				<p className='friendroomusername'>{props.name}</p>
			</div>
			<hr className='usernameline'></hr>
		</>
	)
}


type MessageProps = {
	avatar: string;
	content: string;
	ownMsg: boolean;
}

const Message = (props: MessageProps) => {
	return (
		<div className="message own">
			<div className="messageTop">
				<img className="messageImg" src={props.avatar}/>
				<p className="messageText" >{props.content}</p>
			</div>
		</div>
	)
}

type SendMessageProps = {
	roomId: number;
}

const SendMessage = (props: SendMessageProps) => {
	const [message, setMessage] = useState ('');
	const chatSocket = useContext(chatSocketContext);
	
	const saveMessage = (event: any) => {
		setMessage(event.target.value)
	}
	const sendMessage = () => {
		if (message !== '') {
			chatSocket.emit('message', {roomId: props.roomId, content: message})
		}
	}
	return (
		<div className="chatZoneBottom">
			<textarea className="chatZoneInput" placeholder="write a text...." onChange={saveMessage}></textarea>
			<button className="chatZoneSubmitButton" onClick={sendMessage}><img className="chatZoneSubmitButtonImg" src={require(`../../send.png`)} alt="send" /></button>
		</div>
	)
}

type  ChatZoneProps = {
	chatZoneId: number | null;
	RoomIdToMsgs: Map<number, Conversation>;
}

const ChatZone = (props: ChatZoneProps) => {
	const [ conversation, setConversation ] 	= useState<Conversation | undefined> (undefined);
	const user 									= useContext(UserContext);

	useEffect (() => {
		if (props.chatZoneId !== null) {
			setConversation (props.RoomIdToMsgs.get(props.chatZoneId));
		}

	}, [props.chatZoneId])

	return (
		<div className="chatZone">
			<div className="chatZoneWrapper">
				{conversation === undefined? null: conversation.visibility === 'DM' ? <FriendInfo {...conversation} /> : <RoomInfo {...conversation}/>}
				<div className="chatZoneTop">
					{conversation === undefined? null: conversation.messages.map((msg) => <Message avatar={msg.avatar} content={msg.content} ownMsg={user?.user.id == msg.senderId}/>)}
				</div>
				<div className="chatZoneBottom">
					{conversation === undefined? null: <SendMessage roomId={conversation.roomId} />}
				</div>
			</div>
		</div>
	)
}



type ConvoRoomProps = {
	id				: number;
	name			: string;
	visibility		: string;
	setChatZoneId	: (id: number) => void;
	lastmsg 		: string;
}

const ConvoRoom = (props: ConvoRoomProps) => {
	
	const setChatZoneId = () => {
		props.setChatZoneId(props.id);
	}
	return (
		<div className ="recentConversations" onClick={setChatZoneId}>
			{props.visibility === 'PROTECTED'? <FaLock className="recentConversationsImg" />: props.visibility === 'PUBLIC'? <MdGroups className="recentConversationsImg" />: <GiPrivate className="recentConversationsImg"/>}
			<div className="test">
				<span className="recentConversationsName">{props.name}</span>
				<p>{props.lastmsg}</p>
			</div>
		</div>
	)
}

type ConvoFriendProps = {
	id				: number;
	name			: string;
	avatar			: string;
	setChatZoneId	: (id: number) => void;
	lastmsg 		: string;
}

const ConvoFriend = (props: ConvoFriendProps) => {

	const setChatZoneId = () => {
		props.setChatZoneId(props.id);
	}
	return (
		<div className ="recentConversations" onClick={setChatZoneId}>
			<img className="recentConversationsImg" src={props.avatar} />
			<div className="test">
				<span className="recentConversationsName">{props.name}</span>
				<p>{props.lastmsg}</p>
			</div>
		</div>
	)
}


type ConvoZoneProps = {
	RoomIdToMsgs: Map<number, Conversation>;
	setChatZoneId: (id: number) => void;
	done: boolean;
}

const ConvoZone = (props: ConvoZoneProps) => {
	const  [conversation, setConversations] = useState<JSX.Element[]>([]);

	useEffect (() => {
		setConversations ([]);
		props.RoomIdToMsgs.forEach((value, key) => {
			if (value.visibility === 'DM') {
				let conv = {
					id: value.roomId,
					name: value.name,
					avatar: value.avatar,
					setChatZoneId: props.setChatZoneId,
					lastmsg: value.messages[value.messages.length - 1]?.content
				}
				setConversations ((prev) => [...prev, <ConvoFriend {...conv} key={conv.name}/>])
			}
			else {
				let conv = {
					id: value.roomId,
					name: value.name,
					visibility: value.visibility,
					setChatZoneId: props.setChatZoneId,
					lastmsg: value.messages[value.messages.length - 1]?.content
				}
				setConversations ((prev) => [...prev, <ConvoRoom {...conv} key={conv.name}/>])
			}
		})
	}, [props.done, props.RoomIdToMsgs])

	return (
		<div className='recentMessages'>
			<div className="recentMessagesWrapper">
				<div className="recentMessagesTitle">
					Messages
				</div>
				<div>
					{conversation}
				</div>
			</div>
		</div>
	)
}

type Message = {
	roomId			: number,
	senderId		: number,
	avatar			: string,
	content			: string,
};

type Conversation = {
	roomId		: number,
	visibility	: string,
	name		: string,
	avatar		: string,
	id			: number,
	messages	: Message[],
}

const Chat = () => {
	const [ chatZoneId, setChatZoneId ]			= useState<number | null>(null);
	const [ update, setUpdate] 					= useState<boolean>(false);
	const [ RoomIdToMsgs, setRoomIdToMsgs]		= useState <Map<number, Conversation>> (new Map());
	const user 									= useContext(UserContext);
	const chatSocket							= useContext(chatSocketContext);
	const [done, setDone]						= useState<boolean>(false);
	
	
	useEffect (() => {
		console.log ("fetch");
		axios.get ('http://localhost:3001/room/myrooms', {withCredentials: true}).then ((res) => {
			let tmp: number | null = null;
			for (const room of res.data) {
				if (room.visibility === 'DM') {
					const splits = room.name.split('-');
					let friendId = splits[1] === String(user?.user.id)? Number(splits[2]): Number(splits[1]);
					axios.get (`http://localhost:3001/friend/${friendId}/get`, {withCredentials: true})
					.then ((friend) => {
						axios.get(`http://localhost:3001/message/${room.id}`, {withCredentials: true})
						.then ((messages) => {
							setRoomIdToMsgs ((prev) => {
								prev.set(room.id, {
									roomId: room.id,
									visibility: room.visibility,
									id: friend.data.id,
									name: friend.data.username,
									avatar: friend.data.avatar,
									messages: messages.data,

								});
								return prev;
							})
							// if (chatZoneId === null)
							// 	setChatZoneId (room.id);
								// tmp = room.id;
							setDone (prev => !prev);
						})
					})
				}
				else {
					axios.get(`http://localhost:3001/message/${room.id}`, {withCredentials: true})
					.then ((msgs) => {
						setRoomIdToMsgs ((prev) => {
							prev.set(room.id, {
								roomId: room.id,
								visibility: room.visibility,
								id: room.id,
								name: room.name,
								avatar: '',
								messages: msgs.data,
							});
							return prev;
						})
						// if (chatZoneId === null)
						// 	setChatZoneId (room.id);
						setDone (prev => !prev);
					})
				}
			}

		}).then (() => {
			RoomIdToMsgs.size >  0? setChatZoneId(RoomIdToMsgs.keys().next().value): setChatZoneId(null)
		})

		chatSocket.on('message', (data: Message) => {
			setRoomIdToMsgs ((prev) => {
				let newRoomIdToMsgs = new Map(prev);
				let conversation = newRoomIdToMsgs.get(data.roomId);
				if (conversation) {
					conversation.messages.push(data);
				}
				return newRoomIdToMsgs;
			})
		})

		chatSocket.on('update', () => {
			setUpdate (prev => !prev)
			setDone (prev => !prev);
		})

		return () => {
			chatSocket.off('message');
			chatSocket.off('update');
		}
	}, [update])
	

	
	return (
		<div className='chatApp'>
			<ConvoZone RoomIdToMsgs={RoomIdToMsgs} setChatZoneId={setChatZoneId} done={done}/>
			<ChatZone chatZoneId={chatZoneId} RoomIdToMsgs={RoomIdToMsgs}/>
			<div className="onlineFriendsAndRooms">
				<FriendZone RoomIdToMsgs={RoomIdToMsgs} setChatZoneId={setChatZoneId} done={done}/>
				<RoomZone RoomIdToMsgs={RoomIdToMsgs} setChatZoneId={setChatZoneId} done={done}/>
			</div>
		</div>
	)
}

export default Chat;
