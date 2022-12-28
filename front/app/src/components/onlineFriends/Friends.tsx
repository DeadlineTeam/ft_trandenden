import React from 'react'
import './Friends.css'

const Friends = () => {
    return (
        <div className="friends">
            <div className="onlineFriend">
                <div className="onlineFriendImgContainer">
                    <img className="onlineFriendImg" src={require('../../SolidSnake.png')} alt="Snake" />
                    <div className="onlineFriendDot"></div>
                </div>
                <span className="onlineFriendName">
                    Solid Snake
                </span>
            </div>
        </div> 
    )
}

export default Friends