// socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("https://chatbackendnew-1.onrender.com", { autoConnect: false });
  }
  return socket;
};
