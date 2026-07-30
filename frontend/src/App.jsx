import React, { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 }); 
  const score = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const interval = setInterval(() => {
      const X = Math.floor(Math.random() * (canvas.width));
      const Y = Math.floor(Math.random() * (canvas.height));
      posRef.current = { x: X, y: Y };
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(X, Y, 50, 50);
      ctx.font = "40px Arial";
      ctx.fillText(`Score : ${score.current}`, 75, 75);
    }, 2000);
    return () => clearInterval(interval);
  }, []); 

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const currentPos = posRef.current;
    if (x >= currentPos.x && x <= currentPos.x + 50 && y >= currentPos.y && y <= currentPos.y + 50) {
      score.current += 1;
    }
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
