import React, { useEffect, useRef } from 'react';
import { io } from "socket.io-client";
function App() {
  const canvasRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 }); 
  const playerRef = useRef({});
  const socketRef = useRef(null);
 
  useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  socketRef.current = io("http://localhost:5000");
  const username = prompt("Enter your name");
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(posRef.current.x, posRef.current.y, 50, 50);
    ctx.font = "30px Arial";
    let y = 40;
    for (let id in playerRef.current) {
      ctx.fillText(`${playerRef.current[id].username}: ${playerRef.current[id].score}`, 20, y);
      y += 40;
    }
  }
  socketRef.current.emit("canvasSize", { 
    width: window.innerWidth,
    height: window.innerHeight,
});
  socketRef.current.emit("newPlayer", {username,});
  socketRef.current.on("squareUpdate", (square) => {
    posRef.current = square;
    draw();
  });
  socketRef.current.on("scoreUpdate", (players) => {
    playerRef.current = players;
    draw();
  });
  socketRef.current.on("winner", (data) => { alert(`${data.username} won!`);
});

  return () => {
    socketRef.current.disconnect();
  };
}, []);
  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    socketRef.current.emit("hit", {x,y});
    };
 

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight} 
        style={{ border: '1px solid black', display: 'block' }} 
        onClick={handleClick} 
      />
    </div>
  );
}

export default App;
