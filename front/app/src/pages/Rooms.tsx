import CreateRoom from '../components/createRoom/createRoom'
import RoomsSearch from '../components/roomSearch/roomSearch'
import { useState } from 'react'


const Rooms = () => {
	const [visibleComponent, setVisibleComponent] = useState('RoomSearch')

	const handleCancel = () => {
		setVisibleComponent('RoomSearch')
	}

	const handleCreateRoom = () => {
		setVisibleComponent('CreateRoom')
	}
	
	return (
		<>
			{visibleComponent === 'RoomSearch' && <RoomsSearch handleCreateRoom={handleCreateRoom}/>}
			{visibleComponent === 'CreateRoom' && <CreateRoom handleCancel={handleCancel}/>}
		
		</>
	)
}

export default Rooms