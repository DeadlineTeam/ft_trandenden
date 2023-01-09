import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { gameSocketContext } from '../contexts/socket'
import { useNavigate } from 'react-router-dom'
import "./Matchhistory.css"


const Usernamehis2 = styled.h1`
  position: absolute;
  left: 80%;
  font-size: x-small;
  font-weight: 600;
  margin-right: 2px;
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
    height: 30px;
    position:relative;
    flex-direction: row;
    color: ${({bg}) => bg ? '#000' : '#fff'};
    width: 60%;
    left: 20%;
    margin-top: 2%;
    margin-bottom: 2%;
	gap:2px;

    background-color: ${({bg}) => bg ? '#fff' : '#293135'};
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
			<h1 className='livegame'>Live Games</h1>
			{
			games.map((game, index) => {
		    	return (
		    		<Historitem key={index} bg={Boolean(index % 2)} onClick= {() => watchGame (game.id)}>
		    			<img className='user11img' src={game.leftPlayer.avatar}/>
		    			<Usernamehis1>
							{game.leftPlayer.user}
						</Usernamehis1>
		    			<h1 className='score1'>VS</h1>
		    			<Usernamehis2>
							{game.rightPlayer.user}
						</Usernamehis2>
		    			<img className='user21img' src={game.rightPlayer.avatar}/>
		    		</Historitem>)
				})
			}	
		</div>
  )
}

export default Matchhistory