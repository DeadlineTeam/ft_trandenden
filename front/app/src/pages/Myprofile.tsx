import React from 'react'
import './Myprofile.css'
import styled from 'styled-components'
import Progress_bar from './Progress_bar'
import { createContext, useContext } from 'react';
import { useEffect, useState } from 'react'
import { UserContext } from '../components/ProtectedLayout'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import { array } from 'prop-types';
import {IoMdPersonAdd} from 'react-icons/io'
import {ImBlocked} from 'react-icons/im'
import {CgUnblock} from 'react-icons/cg'
import { Console } from 'console';
import rank1 from '../images/output-onlinepngtools1.png'
import rank11 from '../images/rank11.png'
import rank22 from '../images/rank22.png'
import rank33 from '../images/rank33.png'
import rank2 from '../images/output-onlinepngtools2.png'
import rank3 from '../images/output-onlinepngtools.png'
import { toast } from 'react-toastify';
const Historitem = styled.div<{close: boolean}>`
display: flex;
height: 35px;
position:relative;
flex-direction: row;
color: ${({ close}) => close ? '#000' : '#fff'};
width: 80%;
left: 10%;
margin-top: 2%;
margin-bottom: 2%;
background-color: ${({ close}) => close ? '#fff' : '#A3A3A3'};
@media screen and (max-width: 700px) {
    /* Styles for small screen sizes go here */
    width: 80%;
    height: 20px;
  }
`	

const Usernamehis1 = styled.h1<{close: boolean}>`
position: relative;
left: 2%;
font-size: x-small;
font-weight: 600;
top:15%;
@media screen and (max-width: 700px) {
    /* Styles for small screen sizes go here */
	font-size: 5px;
font-weight: 600;
width:20%;
  }
`
const Usernamehis2 = styled.h1<{close: boolean}>`
position: absolute;
left: 61%;
font-size: x-small;
font-weight: 600;
top:15%;
@media screen and (max-width: 700px) {
    /* Styles for small screen sizes go here */
    position: absolute;
	left: calc(90% - 20px);
    height: 20px;	
		font-size: 5px;
font-weight: 600;
width:20%;
  }
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
  baseURL: `${process.env.REACT_APP_BACK_URL}/profile/`,

});
const instance2 = axios.create({
  baseURL: `${process.env.REACT_APP_BACK_URL}/profile/`,

});

const Myprofile = () => {
  	const [itsme, setItsme] = useState(true);
  	const location = useLocation()
  	var [username1, setUsername] = useState("");
  	const [id, setId] = useState(0)
  	const [avatarurl,setAvatarurl] = useState("")
  	const [leveluser, setLevel] = useState(0)
  	const [maphistory, setMaphistory] = useState(Array<any>())
  	const [stats, setStats] = useState(Array<any>())
  	const [friendship, setFriendship] = useState("")
  	const [win, setWin] = useState(0)
  	const [lose, setLose] = useState(0)
  	const [totalgames, setTotalgames] = useState(0)
  	const [winrate1, setWinrate] = useState(0)
	  const user = useContext(UserContext)

	const [render, setRender] = useState (false);
	const [valrank, setValrank] = useState(0);
	const navigate = useNavigate();

  	useEffect(()=>{
    	var stri = window.location.pathname.split("/",3)[2];
      	if(stri == "me")
        	setItsme(false)
		else
			setItsme(true)
		instance.post('iconinfo/',{username: stri},{withCredentials: true} ).then((response) =>{
			setAvatarurl(response.data.avatar_url)
			setLevel(response.data.level)
			setUsername(response.data.username)
			setFriendship(response.data.friendship)
			setId(response.data.id)
      	}).catch(()=>{
			navigate("/Notfound")
		})
      	
		const url3 = `${process.env.REACT_APP_BACK_URL}/profile/gameHistory`
      	axios.post(url3, {username: stri},{withCredentials: true}).then((response2) =>{
     		setMaphistory(response2.data)
      	}).catch(error=>{
			setMaphistory([])
		})
      
		const url4 = `${process.env.REACT_APP_BACK_URL}/profile/stats`
      	axios.post(url4, {username: stri},{withCredentials: true}).then((response3) =>{
			setStats (response3.data)
			setWin(response3.data.win)
			setLose(response3.data.loss)
			setWinrate(Math.floor(response3.data.winrate * 100))
			setTotalgames(response3.data.totalgames)
			setValrank(response3.data.rank)
      	}).catch(error=>{
			
		})
    },[location.pathname, render])


	const handleadd = (e:any) =>{
		const url4 = `${process.env.REACT_APP_BACK_URL}/`
		axios.post(`${url4}friend/${id}/add`, {},{withCredentials: true}).then((response2) =>{
			setRender (!render);
		})
	}

	const handleblock = (e:any) =>{
		const url4 = `${process.env.REACT_APP_BACK_URL}/`
		axios.post(`${url4}friend/${id}/block`, {},{withCredentials: true}).then((response2) =>{
			setRender (!render);
		})
	}
	const handleunblock = (e:any) =>{
		const url4 = `${process.env.REACT_APP_BACK_URL}/`
		axios.post(`${url4}friend/${id}/unblock`, {},{withCredentials: true}).then((response2) =>{
			setRender (!render);
		})
	}
	

	var  intvalue = Math.floor(leveluser)
	let level = leveluser;
	let levelbar = level - intvalue;
	levelbar = levelbar * 100;
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

    		{itsme && friendship == "NOT_FRIENDS" &&(
			
    		<button className = 'addbutton' onClick={handleadd}>
    		  <div className='itembutton' ></div>
    		  <IoMdPersonAdd/>
    		</button>)
			}
			{itsme && friendship == "FRIENDS" &&(
			
    		<button className = 'addbutton' onClick={handleblock}>
    		  <div className='itembutton' ></div>
    		  <ImBlocked/>
    		</button>)
			}
			{itsme && friendship == "BLOCKED" &&(
			
    		<button className = 'addbutton' onClick={handleunblock} >
    		  <div className='itembutton'></div>
    		  <CgUnblock/>
    		</button>)
			}


	
			
			
			<img className='Profileimg' src={myimage} />
			<p className='name'>{name}</p>
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
					<div className='Rankranks'>
					{valrank < 1&& (
						<img className='ranking' src={rank1}/>
					)
}
					{valrank >=1 && (
						<img className='ranking' src={rank11}/>
					)
					}
					{ valrank >= 2 && (
					<img className='ranking' src={rank22}/>
					)}
					{ valrank <2  && (
					<img className='ranking' src={rank2}/>
					)}
					</div>
					{ valrank == 3 && (
					<img className='ranking1' src={rank33}/>
					)}
					{ valrank <3 && (
					<img className='ranking1' src={rank3}/>
					)}
					
				</div>
			</div>
		</div>
		<div className='secondpart'>
		<h1 className='Matchhead' >
		MATCH HISTORY
		</h1>
		<div className='matchhistory1'>
			{maphistory.map((value, index)=>{
				return(
							<Historitem close={true} className="Historitem" key={index}>
								<img className='user1img' src={value.player1.avatar}/>
								<Usernamehis1 close={value.true}>{value.player1.username}</Usernamehis1>
        						<h2 className='usernamehistory'>level {Math.floor(value.player1.level)}</h2>
								<div className='result'>result
								<h1 className='score'>{value.player1.score} vs {value.player2.score} </h1></div>
								<img className='user2img' src={value.player2.avatar}/>
								<Usernamehis2 close={value.Boolean}>{value.player2.username}</Usernamehis2>
								<h2 className='usernamehistory2'>level { Math.floor(value.player2.level)}</h2>
					
							</Historitem> 

					  )}) }
		</div>  
</div>     
</div>
)
}
export default Myprofile
