import { useEffect, useState, createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar2 from "./Sidebar2";
import axiosApi from "../api/axiosApi"
import axios from "axios";
import Bookdata from "../data.json"


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GameInviteNotif } from "./notifications/gameInvite";
import { onlineSocketContext } from "../contexts/socket";

type User = {
	id : string;
	name : string
}
type IuserContext = {
	user : User
	updateUser : (user : User) => void
}
export const UserContext = createContext<IuserContext | null>(null);





export default function ProtectedLayout() {

	const [loading , setLoading] = useState(true);
	const [user, setUser] = useState({} as User);
	const navigate = useNavigate();
	
	const onlineSocket = useContext (onlineSocketContext);

	function updateUser (user : User) {
		setUser(user);
	}

	useEffect(() => {
		async function  authenticateUser() {
			// const axiosapi = axiosApi ();
			axios.get('http://localhost:3001/getUser', {
				withCredentials: true,
			}).then((data)=> {
				console.log (document.cookie)
				console.log ("already logged in")
				setLoading(false);
				// navigate("/");
			}).catch((err) => {
				console.log(err);
				setLoading(false);
				navigate("/login");
			});
		}
		authenticateUser();
	}, []);

	useEffect (() => {
		onlineSocket.on ("notification", (notification) => {
			console.log ("notification --------------->", notification);
			if (notification.type === "GameInvite")
				toast (<GameInviteNotif UserName = {notification.message.inviter} GameId= {notification.message.id}/>)
			if (notification.type === "GameInviteDeclined") {
				console.log ("GameInviteDeclined --------------->", notification);
				toast (`Game Invitation declined`)
			
			}
		})

		return () => {
			onlineSocket.off ("notification");
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