import React from 'react'
import './Myprofile.css'
import styled from 'styled-components'
import Progress_bar from './Progress_bar'
import { createContext, useContext } from 'react';
import { useEffect, useState } from 'react'
import { UserContext } from '../components/ProtectedLayout'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { array } from 'prop-types';
import {IoMdPersonAdd} from 'react-icons/io'
const Historitem = styled.div<{close: boolean}>`
display: flex;
height: 12%;
position:relative;
flex-direction: row;
color: ${({ close}) => close ? '#000' : '#fff'};
width: 80%;
left: 10%;
margin-top: 2%;
margin-bottom: 2%;
background-color: ${({ close}) => close ? '#fff' : '#A3A3A3'};
`

const Usernamehis1 = styled.h1<{close: boolean}>`
position: relative;
left: 2%;
font-size: x-small;
font-weight: 600;
top:15%;
`
const Usernamehis2 = styled.h1<{close: boolean}>`
position: relative;
left: 61%;
font-size: x-small;
font-weight: 600;
top:15%;
`

interface iconinfo{
username : string;
avatar_url: string;
level: number;
}

interface result {

avatar_url: string;

}

const instance = axios.create({
  baseURL: 'http://localhost:3001/profile/',

});
const instance2 = axios.create({
  baseURL: 'http://localhost:3001/profile/',

});

const Myprofile = () => {


  const location = useLocation()

  useEffect(()=>{


      if(stri == "me")
        setItsme(false)
    instance.post('iconinfo/',{username: stri},{withCredentials: true} ).then((response) =>{
      setAvatarurl(response.data.avatar_url)
      setLevel(response.data.level)
      setUsername(response.data.username)
      })
      const url3 = "http://localhost:3001/profile/gameHistory"
      axios.post(url3, {username: stri},{withCredentials: true}).then((response2) =>{
        console.log(response2.data)
     setMaphistory(response2.data)
      })
      const url4 = "http://localhost:3001/profile/stats"
      axios.post(url4, {username: stri},{withCredentials: true}).then((response3) =>{
        console.log(response3.data)
     setStats (response3.data)
     setWin(response3.data.win)
     setLose(response3.data.loss)
     setWinrate(response3.data.winrate)
     setTotalgames(response3.data.totalgames)

      })


   /* const url = "http://localhost:3001/profile/iconInfo/"
    axios.post(url, {username: str[2]},{withCredentials: true}).then((response) =>{
    setAvatarurl(response.data.avatar_url)
    setLevel(response.data.level)
    setUsername(response.data.username)
    })*/
    },[location.pathname])



    var stri = window.location.pathname.split("/",3)[2];


var [username1, setUsername] = useState("");
const [avatarurl,setAvatarurl] = useState("")
const [leveluser, setLevel] = useState(0)
const [maphistory, setMaphistory] = useState(Array<any>())
const [stats, setStats] = useState(Array<any>())
const [win, setWin] = useState(0)
const [lose, setLose] = useState(0)
const [totalgames, setTotalgames] = useState(0)
const [winrate1, setWinrate] = useState(0)
const user = useContext(UserContext)
	console.log(window.location.pathname);


	//yields: "/js" (where snippets run)

var intvalue = Math.floor(leveluser)
	let level = leveluser;
	let levelbar = level - intvalue;
	levelbar = levelbar * 100;
    const [itsme, setItsme] = useState(true);
	const name:string = username1;
	var myimage = avatarurl;
	const nickname:string = "Flen Ben Flen"
	let winrate:number = 57
	let Totalgamepl:number= 17
	let gamewin:number= 7
	let gamelose:number=5


	
return (
		<div className='full'>
		<div className='firstpart'>
		<div className='profi'>
      {itsme &&(
    <button className = 'addbutton'>
      <div className='itembutton'></div>
      <IoMdPersonAdd/>
    </button>)
}
		<img className='Profileimg' src={myimage} />
		<p className='name'>{name}</p>
		<p className='nickname'>#{nickname}</p>
		<div className='levelbar'>
		<Progress_bar progress={levelbar} />
		</div>
		<p className='level'>level {intvalue}</p>

		</div>

		<div className='stats'>
		<div className='statsinfo'>
		<h1 className='Stathead'>STATS</h1>
		<div className='sta1'>
		<p className='stahead'>win rate %</p>
		<p className='stainfo'>{winrate1} %</p>
		</div>
<div className='sta2'>
<p className='stahead'>Total games played</p>
<p className='stainfo'>{totalgames} games</p>
</div>
<div className='sta3'>
<p className='stahead'>Total Wins games</p>
<p className='stainfo'>{win} games</p>
</div>
<div className='sta4'>
<p className='stahead'>Total loses games</p>
<p className='stainfo'>{lose} games</p>
</div>
</div>
<div className='rank'>
<h1 className='rankhead'>RANK</h1>
</div>
</div>
</div>
<div className='secondpart'>
<h1 className='Matchhead' >
MATCH HISTORY
</h1>
<div className='matchhistory1'>
{maphistory.map((value)=>{
		return(
				<div className='matchhistoryp'>
				<Historitem close={true}>
				<img className='user1img' src={value.player1.avatar}/>
				<Usernamehis1 close={value.true}>{value.player1.username}</Usernamehis1>
        <h2 className='usernamehistory'>level {value.player1.level}</h2>
				<div className='result'>result
				<h1 className='score'>{value.player1.score} vs {value.player2.score} </h1></div>
				<img className='user2img' src={value.player2.avatar}/>
				<Usernamehis2 close={value.Boolean}>{value.player2.username}</Usernamehis2>
				<h2 className='usernamehistory2'>level {value.player2.level}</h2>
		
				</Historitem> 
				</div>
			  )}) }
</div>  
</div>     
</div>
)
}
export default Myprofile
