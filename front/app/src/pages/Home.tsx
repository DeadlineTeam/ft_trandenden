import { GameChoose } from "../components/game/GameMode"
import useUserContext from "../hooks/useUser"
import "./Home.css"
import Matchhistory from "./Matchhistory"

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