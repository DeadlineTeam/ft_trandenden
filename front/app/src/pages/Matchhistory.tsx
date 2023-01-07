import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { gameSocketContext } from '../contexts/socket'
import { useNavigate } from 'react-router-dom'
import "./Matchhistory.css"


const Usernamehis2 = styled.h1`
  position: relative;
  left: 61%;
  font-size: x-small;
  font-weight: 600;
  top:15%;
`

const Usernamehis1 = styled.h1`
  position: relative;
  left: 2%;
  font-size: x-small;
  font-weight: 600;
  top:15%;
`

const Historitem = styled.div<{bg: boolean}>`
    display: flex;
    height: 12%;
    position:relative;
    flex-direction: row;
    color: ${({bg}) => bg ? '#000' : '#fff'};
    width: 60%;
    left: 20%;
    margin-top: 2%;
    margin-bottom: 2%;
    background-color: ${({bg}) => bg ? '#fff' : '#A3A3A3'};
`

interface LiveMatch {
	id: string,
	leftPlayer: {
		user: string
		avatar: string
	},
	rightPlayer: {
		user: string
		avatar: string
	}
}


const Matchhistory = () => {
	const [games, setGames] = useState <LiveMatch[]> ([]);
	const socket = useContext (gameSocketContext)
	const navigate = useNavigate ();

	useEffect (() => {
		socket.emit ("LiveGames")

		socket.on ("LiveGames", (games: LiveMatch []) => {
			setGames(games);
		})
		return  () => {
			socket.emit ("noBroadcast");
			socket.off ("LiveGames");
		}
	}, [])

	const watchGame = (gameId: string) => {
		navigate ('/Game?watch=' + gameId)
	}


	return (
		<div className='match'>
			<h1>Live Games</h1>
			{
			games.map((game, index) => {
		    	return (
		    		<Historitem key={index} bg={Boolean(index % 2)} onClick= {() => watchGame (game.id)}>
		    			<img className='user1img' src={game.leftPlayer.avatar}/>
		    			<Usernamehis1>
							{game.leftPlayer.user}
						</Usernamehis1>
		    			<h1 className='score'>VS</h1>
		    			<img className='user2img' src={game.rightPlayer.avatar}/>
		    			<Usernamehis2>
							{game.rightPlayer.user}
						</Usernamehis2>
		    		</Historitem>)
				})
			}	
		</div>
  )
}

export default Matchhistory