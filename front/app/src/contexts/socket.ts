import io from "socket.io-client"
import React from "react";


const gameSocket = io("http://localhost:3001/playgame", {
	withCredentials: true
})

const onlineSocket = io ("http://localhost:3001/online", {
	withCredentials: true,
})

const chatSocket = io("http://localhost:3001/chat", {
	withCredentials: true,
})


export const onlineSocketContext = React.createContext (onlineSocket);
export const gameSocketContext = React.createContext (gameSocket);
export const chatSocketContext = React.createContext(chatSocket);




