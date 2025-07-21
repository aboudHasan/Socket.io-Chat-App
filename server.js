import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { formatMessage } from "./utils/messages.js";
import { userJoin, getUser, userLeave, getRoomUsers } from "./utils/users.js";

const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("new message", (msg) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("msg", formatMessage(user.username, msg));
  });

  socket.on("username and room", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("msg", formatMessage("Chatcord Bot", "Welcome to chatcord"));

    socket.broadcast
      .to(user.room)
      .emit(
        "new connection",
        formatMessage("Chatcord Bot", `${user.username} has connected`)
      );
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    io.to(user.room).emit(
      "msg",
      formatMessage("Chatcord Bot", `${user.username} has disconnected`)
    );
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => console.log(`Server is running on port ${port}`));
