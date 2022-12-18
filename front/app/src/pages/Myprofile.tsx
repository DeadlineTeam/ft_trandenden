import React from 'react'
import './Myprofile.css'
import myimage from '../ss3.jpg'
const Myprofile = () => {
  const name:string = "Flen Ben Flen"
  const nickname:string = "Flen Ben Flen"
  let winrate:number = 57
  let Totalgamepl:number= 17
  let gamewin:number= 7
  let gamelose:number=5


  return (
    <div className='full'>
      <div className='firstpart'>
        <div className='profi'>
          <img className='Profileimg' src={myimage} alt="sqdqs" />
          <p className='name'>{name}</p>
          <p className='nickname'>#{nickname}</p>
          <p className='level'>level 7</p>

        </div>

        <div className='stats'>
          <div className='statsinfo'>
            <h1 className='Stathead'>STATS</h1>
            <div className='sta1'>
              <p className='stahead'>win rate %</p>
              <p className='stainfo'>{winrate} %</p>
            </div>
            <div className='sta2'>
              <p className='stahead'>Total games played</p>
              <p className='stainfo'>{Totalgamepl} games</p>
            </div>
            <div className='sta3'>
              <p className='stahead'>Total Wins games</p>
              <p className='stainfo'>{gamewin} games</p>
            </div>
            <div className='sta4'>
              <p className='stahead'>Total loses games</p>
              <p className='stainfo'>{gamelose} games</p>
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
      </div>     
    </div>
  )
}

export default Myprofile