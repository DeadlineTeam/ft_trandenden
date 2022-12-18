import React from 'react'
import "./styles.css"
const Navbar:React.FC = () => {
  return (
    <div  className="board">
        <ul className="boardul">
            <li className="boardil" >Home</li>
            <li className="boardil">leaderBoard</li>
            <li className="boardil">Settings</li>
            <li className="boardil">Profile</li>

        </ul>
    </div>
  )
}

export default Navbar