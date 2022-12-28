import React from 'react'
import './createRoom.css'

const PasswordField = ({ password, setPassword, visibility }: { password: string, setPassword: (password: string) => void, visibility: string }) => {
    return (
        <div className="child5">
          <p>Password :</p>
          <input className="inputFieldPassword" type="password" id="password" value={password} required={visibility === 'Protected'} onChange={(e) => setPassword(e.target.value)}/>
        </div>
    )
}


export default PasswordField