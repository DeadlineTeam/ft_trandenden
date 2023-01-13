import { useEffect, useState, createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar2 from "./Sidebar2";
import axios from "axios";
import Bookdata from "../data.json"


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GameInviteNotif } from "./notifications/gameInvite";
import { gameSocketContext, onlineSocketContext, chatSocketContext} from "../contexts/socket";

type User = {
	id 			: number;
	username	: string;
}
type IuserContext = {
	user : User
	updateUser : (user : User) => void
}
export const UserContext = createContext<IuserContext | null>(null);


type Message = {
	roomId			: number,
	senderId		: number,
	avatar			: string,
	content			: string,
	senderName		: string,
};


export default function ProtectedLayout() {

	const [loading , setLoading] = useState(true);
	const [user, setUser] = useState({} as User);
	const navigate = useNavigate();
	
	const onlineSocket = useContext (onlineSocketContext);
	const chatSocket = useContext (chatSocketContext);
	const gameSocket = useContext (gameSocketContext);

	function updateUser (user : User) {
		setUser(user);
	}

	useEffect(() => {
		async function  authenticateUser() {
			// const axiosapi = axiosApi ();
			axios.get(`${process.env.REACT_APP_BACK_URL}/getUser`, {
				withCredentials: true,
			}).then((res)=> {
				setUser ({
					id: res.data.userId,
					username: res.data.username
				})
				onlineSocket.disconnect ();

				// connect to the socket
				// check if it is connected 

				onlineSocket.connect ();

				chatSocket.disconnect ();
				chatSocket.connect ();

				gameSocket.disconnect ();
				gameSocket.connect ();

				// check if the socket is connected
		
				
				
				// onlineSocket.emit ("login");
				setLoading(false);
			}).catch((err) => {
				setLoading(false);
				navigate("/login");
			});
		}
		authenticateUser();
	}, []);

	useEffect (() => {
		
		onlineSocket.on ("notification", (notification) => {
			if (notification.type === "GameInvite")
				toast (<GameInviteNotif UserName = {notification.message.inviter} GameId= {notification.message.id}/>)
			if (notification.type === "GameInviteDeclined") {
				toast (`Game Invitation declined`)
			}

			if (notification.type === "friendship") {
				toast (notification.message)
			}

			if (notification.type === "message") {
				axios.get(`${process.env.REACT_APP_BACK_URL}/getUser`, {withCredentials: true,})
				.then((res)=> {
					if (notification.message.senderId !== res.data.userId) {
						axios.get (`${process.env.REACT_APP_BACK_URL}/room/get/${notification.message.roomId}`, {withCredentials: true})
						.then ((res) => {
							if (res.data.visibility !== "DM") {
								toast (`[${res.data.name}] ${notification.message.senderName} :${notification.message.content}`)
							}
							else {
								toast (`${notification.message.senderName} :${notification.message.content}`)
							}
						})
					}

				})
			}
		})

		onlineSocket.on ('update', (data: {action: string, roomId: number}) => {
			chatSocket.emit (data.action, {roomId: data.roomId});
		})

		onlineSocket.on("logout", () => {
			navigate ("/login");
		})


		return () => {
			onlineSocket.off ('update');
			onlineSocket.off ("notification");
			onlineSocket.off ("logout");
			onlineSocket.disconnect ();
		}
	}, [])


  if (loading)
  	return (<div>loading...</div>)

  return (
	< UserContext.Provider value={{user, updateUser}}>
        <ToastContainer />
		<Sidebar2 placeholder="Enter usernaame" data={Bookdata}/>
  		<Outlet />
	</ UserContext.Provider>
  )
  
}