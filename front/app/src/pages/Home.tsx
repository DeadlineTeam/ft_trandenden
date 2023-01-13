import { GameChoose } from "../components/game/GameMode"
import "./Home.css"
import Matchhistory from "./Matchhistory"
import { UserContext } from "../components/ProtectedLayout"
import { useContext } from "react"

const Home = () => {
  	
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