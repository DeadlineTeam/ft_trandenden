import axios from 'axios';
import React, { useEffect } from 'react'
import './RecentChats.css'

const RecentChats = () => {
    
    return (
        <div className ="recentConversations" >
            <img className="recentConversationsImg" src={require('../../LiquidSnake.png')} alt="Snake"/>
            <span className="recentConversationsName">Liquid Snake</span>
        </div>
    )
}

export default RecentChats