// socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://chatb-vrft.onrender.com", { autoConnect: false });
  }
  return socket;
};
