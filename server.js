const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const port = 3000;
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});
let NumberOfOnlineUsers = 0;

io.on("connection", (socket) => {
  NumberOfOnlineUsers = ++NumberOfOnlineUsers;
  io.emit("onlineUsers", NumberOfOnlineUsers);

  
  console.log("a user connected", socket.id);
  console.log("Number of online users", NumberOfOnlineUsers);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    NumberOfOnlineUsers = --NumberOfOnlineUsers;
    io.emit("onlineUsers", NumberOfOnlineUsers);
    console.log("a user disconnected");
  });
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
