import io from "socket.io-client"
import React from "react";


const gameSocket = io("http://localhost:3001/playgame", {
	withCredentials: true
})

export const gameSocketContext = React.createContext (gameSocket);




