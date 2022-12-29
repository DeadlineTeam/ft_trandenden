import React from 'react'
import './RecentChats.css'

const RecentChats = () => {
    return (
        <div className="recentConversations">
            <img className="recentConversationsImg" src={require('../../SolidSnake.png')} alt="Snake"/>
            <span className="recentConversationsName">Solid Snake</span>
        </div>
    )
}

export default RecentChats