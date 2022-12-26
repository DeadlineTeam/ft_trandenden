import { useEffect, useState, createContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar2 from "./Sidebar2";
import axiosApi from "../api/axiosApi"
import axios from "axios";


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
				navigate("/");
			}).catch((err) => {
				console.log(err);
				setLoading(false);
				navigate("/login");
			});
		}
		authenticateUser();
	}, []);




  if (loading)
  	return (<div>loading...</div>)

  return (
	< UserContext.Provider value={{user, updateUser}}>
		<Sidebar2 placeholder="Enter usernaame" data={[]}/>
  		<Outlet />
	</ UserContext.Provider>
  )
  
}