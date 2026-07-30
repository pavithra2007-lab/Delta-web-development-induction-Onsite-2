import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {
    origin: "http://localhost:5173",
  },});

app.use(cors());
app.use(express.json());
const gameState = {
  sqr: { x: 100, y: 100,}, 
  players: {},};

let canvasWidth = 1000;
let canvasHeight = 600;

setInterval(() => {
  gameState.sqr.x = Math.floor(Math.random() * canvasWidth);
  gameState.sqr.y = Math.floor(Math.random() * canvasHeight);
  io.emit("squareUpdate", gameState.sqr);
}, 2000);

io.on("connection", (socket) => {
  socket.on("canvasSize", ({ width, height }) => {
  canvasWidth = width;
  canvasHeight = height;
});
  socket.emit("squareUpdate", gameState.sqr);
  io.emit("scoreUpdate", gameState.players);
  socket.on("newPlayer", ({ username }) => {gameState.players[socket.id] = {
        username:username,score: 0,
    };
    io.emit("scoreUpdate", gameState.players);
});
  socket.on("hit", ({ x, y }) => {
    const sq = gameState.sqr;
    if ( x >= sq.x && x <= sq.x + 50 && y >= sq.y && y <= sq.y + 50
    ) {
      gameState.players[socket.id].score++;
       if (gameState.players[socket.id].score >= 10) {
      io.emit("winner", {username: gameState.players[socket.id].username,});
    }
      io.emit("scoreUpdate", gameState.players);
    }
  });
  socket.on("disconnect", () => {
    delete gameState.players[socket.id];
    io.emit("scoreUpdate", gameState.players);
  });
});
app.get("/", (req, res) => {
  res.send("Backend Running");
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
