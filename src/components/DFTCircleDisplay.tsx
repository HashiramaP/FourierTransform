// DFTCircleDisplay.tsx
import React, { useRef, useEffect } from 'react';
import dft from '../utils/dft';

interface Point {
  x: number;
  y: number;
}

interface Circle {
  amplitude: number;
  phase: number;
  frequency: number;
}

interface DFTCircleDisplayProps {
  points: Point[];
  frequencies: number[];
}

const DFTCircleDisplay: React.FC<DFTCircleDisplayProps> = ({
  points,
  frequencies,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const path: Point[] = []; // Array to store the path of the endpoint

  // Function to generate circles based on DFT
  const generateCircles = (
    points: Point[],
    frequencies: number[],
  ): Circle[] => {
    return frequencies.map(frequency => {
      const { amplitude, phase } = dft(points, frequency);
      return { amplitude, phase, frequency };
    });
  };

  // Draw the circles and red dot path on the canvas
  const drawCircles = (
    circles: Circle[],
    time: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let x = ctx.canvas.width / 2;
    let y = ctx.canvas.height / 2;

    // Draw each circle and calculate the endpoint
    circles.forEach(circle => {
      const radius = circle.amplitude;
      const angle = circle.phase + time * circle.frequency;

      const nextX = x + radius * Math.cos(angle);
      const nextY = y + radius * Math.sin(angle);

      // Draw the circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.stroke();

      // Draw the rotation line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Update center for next circle
      x = nextX;
      y = nextY;
    });

    // Draw the red dot at the end position
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Store the endpoint in the path array
    path.push({ x, y });

    // Draw the path
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = 'red';
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const circles = generateCircles(points, frequencies);
    let animationFrameId: number;

    const render = (time: number) => {
      drawCircles(circles, time / 1000, ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [points, frequencies]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ border: '1px solid black' }}
    />
  );
};

export default DFTCircleDisplay;
