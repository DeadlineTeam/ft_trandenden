import React from 'react'
import "./Db.css"
import myimage from '../ss3.jpg'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { valueToNode } from '@babel/types'


const DashBoard = () => {
  const[leaderboard, setLeaderboard] = useState(Array<any>())
  useEffect(()=>{
      const url4 = "http://localhost:3001/users/leaderboard"
      axios.get(url4,{withCredentials: true}).then((response3) =>{
      setLeaderboard(response3.data)
      })
    },[])  
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
                <td>{Math.floor(item.winrate * 100)} %</td>
                <td>{item.totalgames}</td>
                <td>{item.win}/{item.loss}</td>
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