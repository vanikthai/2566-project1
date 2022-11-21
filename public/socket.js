import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

export default () => {
  window.send = (medthod, data) => {
    try {
      socket.emit(medthod, data);
    } catch (e) {
      console.log("can't send data to server");
    }
  };

  window.recive = (medthod) => {
    try {
      socket.on(medthod, (msg) => {
        console.log(msg);
        return msg;
      });
    } catch (e) {
      console.log("No data from server");
    }
  };
};
