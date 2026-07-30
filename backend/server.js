import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);

const socket = new WebSocket("ws://localhost:5000");

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('newPlayer', () => {
  gameState.players[socket.id] = {
    score:0,
  }
});
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
