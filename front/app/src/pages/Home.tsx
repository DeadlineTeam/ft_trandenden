import { GameChoose } from "../components/game/GameMode"
import useUserContext from "../hooks/useUser"
import "./Home.css"
import Matchhistory from "./Matchhistory"
import { UserContext } from "../components/ProtectedLayout"
import { useContext } from "react"
import axios from "axios"

import { useEffect, useState} from "react";
// import { onlineSocketContext } from "../contexts/socket";

const Home = () => {
	const user = useContext (UserContext);
	// const socket = useContext (onlineSocketContext);
	// useEffect (() => {
	// 	socket.on ('online2',  () => {
	// 		console.log ("online2")
	// 	})
	// 	socket.on ('offline2', () => {
	// 		console.log ('offline2')
	// 	})
	// 	return () => {
	// 		socket.off ('online1')
	// 		socket.off ('offline1')
	// 	}
	// }, [])

  	return (
	<div className='fullhome'>
		<GameChoose/>
		<div className='matchhistory'>
			<Matchhistory />
		</div>
	</div>
  )
}


export default Home