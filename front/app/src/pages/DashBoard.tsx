import React from 'react'
import "./Db.css"
import myimage from '../ss3.jpg'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { valueToNode } from '@babel/types'


const DashBoard = () => {
  useEffect(()=>{


      const url4 = "http://localhost:3001/users/leaderboard"
      axios.get(url4,{withCredentials: true}).then((response3) =>{
        setLeaderboard(response3.data)
        console.log(response3.data)
      })

  
   /* const url = "http://localhost:3001/profile/iconInfo/"
    axios.post(url, {username: str[2]},{withCredentials: true}).then((response) =>{
    setAvatarurl(response.data.avatar_url)
    setLevel(response.data.level)
    setUsername(response.data.username)
    })*/
    },[])

    const[leaderboard, setLeaderboard] = useState(Array<any>())

  const data = [
    {
      Rank :1,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :5,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :2,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :3,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    },
    {
      Rank :4,
      User1 : "Flen flen",
      winrate : 25,
      gameplayed : 15,
      win: 17,
      lose: 30,
      level: 8,
    }
  ]
  return (
  <div className='opop'>
    <div className='mmm'>
    <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>name</th>
            <th>winrate</th>
            <th>gameplayed</th>
            <th>w/l</th>
            <th>level</th>
          </tr>
          </thead>
        </table>
    </div>
    <div className='center'>

      <table>

          <tbody>
        {leaderboard.map((item, index) => {
            return (
           
              <tr key={index}>
                <td scope="row">
                  <img className='imgg' src={item.avatar_url}/>
                  <p className='itemerank'>{item.id}</p>
                </td>
                <td>{item.username}</td>
                <td>{item.winrate}</td>
                <td>{item.totalgames}</td>
                <td>12/12t</td>
                <td>{item.level}</td>
              </tr>
              
            );
          })}
          </tbody>
          </table>
    </div>
    </div>
  )
}

export default DashBoard