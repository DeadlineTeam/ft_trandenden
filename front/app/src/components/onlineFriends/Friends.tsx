import axios from 'axios'
import React from 'react'
import './Friends.css'


const Friends = (props:any) => {
    return (
        <div className="friends" >
            <div className="onlineFriend" key={props.id}>
                <div className="onlineFriendImgContainer">
                    <img className="onlineFriendImg" src={require(`../../${props.profilePicture}`)} alt="Snake" />
                    {/* Add class onfflineFriendDot if deconnected */}
                    <div className="onlineFriendDot"></div> 
                </div>
                <span className="onlineFriendName">
                    {props.username}
                </span>
                <button className="settingsButton" onClick={props.handleUserProfile}><img className="settingsImg" src={require('../../userProfile.png')} alt="" /></button>
            </div>
        </div> 
    )
}

export default Friends