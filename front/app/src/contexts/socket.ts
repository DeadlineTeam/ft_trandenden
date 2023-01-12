import io from "socket.io-client"
import React from "react";


const gameSocket = io(`${process.env.REACT_APP_BACK_URL}/playgame`, {
	withCredentials: true
})

const onlineSocket = io (`${process.env.REACT_APP_BACK_URL}/online`, {
	withCredentials: true,
})

const chatSocket = io(`${process.env.REACT_APP_BACK_URL}/chat`, {
	withCredentials: true,
})


export const onlineSocketContext = React.createContext (onlineSocket);
export const gameSocketContext = React.createContext (gameSocket);
export const chatSocketContext = React.createContext(chatSocket);




