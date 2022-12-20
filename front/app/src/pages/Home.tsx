import { GameChoose } from "../components/game/GameMode"
import useUserContext from "../hooks/useUser"
import "./Home.css"

const Home = () => {
	const user = useUserContext();

	console.log(user);

  return (
	<div className='fullhome'>
		<GameChoose/>
	</div>
  )
}


export default Home