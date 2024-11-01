import React, { useEffect, useRef, useState } from 'react';

interface FilePathDisplayProps {
  filePath: string;
}

const FilePathDisplay: React.FC<FilePathDisplayProps> = ({ filePath }) => {
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>(
    [],
  );
  const [fourierTransform, setFourierTransform] = useState([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await fetch(filePath);
        const text = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, 'image/svg+xml');

        const extractedCoordinates: { x: number; y: number }[] = [];
        const pathElements = svgDoc.querySelectorAll('path');

        pathElements.forEach(el => {
          const pathData = el.getAttribute('d') || '';
          const pathCoords = extractPathCoordinates(pathData);
          extractedCoordinates.push(...pathCoords);
        });

        setCoordinates(extractedCoordinates);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSVG();
  }, [filePath]);

  const extractPathCoordinates = (
    pathData: string,
  ): { x: number; y: number }[] => {
    const coords: { x: number; y: number }[] = [];
    const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
    let currentX = 0;
    let currentY = 0;

    commands.forEach(command => {
      const type = command[0];
      const points = command
        .slice(1)
        .trim()
        .split(/\s+/)
        .flatMap(point => {
          const parts = point.match(/-?\d*\.?\d+/g);
          return parts ? parts.map(num => parseFloat(num)) : [];
        })
        .filter(num => !isNaN(num));

      for (let i = 0; i < points.length; i += 2) {
        let x = points[i];
        let y = points[i + 1];
        switch (type) {
          case 'M':
          case 'm':
            currentX = type === 'M' ? x : currentX + x;
            currentY = type === 'M' ? y : currentY + y;
            coords.push({ x: currentX, y: currentY });
            break;
          // Other cases for L, H, V, etc.
        }
      }
    });

    return coords;
  };

  function dft(x) {
    const X = [];
    const N = x.length;
    const TWO_PI = 2 * Math.PI;

    for (let k = 0; k < N; k++) {
      let re = 0;
      let im = 0;

      for (let n = 0; n < N; n++) {
        const realPart = x[n].x;
        const imagPart = x[n].y;
        const phi = (TWO_PI * k * n) / N;

        re += realPart * Math.cos(phi) - imagPart * Math.sin(phi);
        im += realPart * Math.sin(phi) + imagPart * Math.cos(phi);
      }

      re = re / N;
      im = im / N;

      let freq = k;
      let amp = Math.sqrt(re * re + im * im);
      let phase = Math.atan2(im, re);

      X[k] = { re, im, freq, amp, phase };
    }

    setFourierTransform(X);
    return X;
  }

  useEffect(() => {
    if (coordinates.length > 0) {
      dft(coordinates);
    }
  }, [coordinates]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = canvas.width / 2;
    let y = canvas.height / 2;

    fourierTransform.forEach((component, index) => {
      const { amp, phase, freq } = component;

      const prevX = x;
      const prevY = y;

      x += amp * Math.cos(freq * Date.now() * 0.002 + phase);
      y += amp * Math.sin(freq * Date.now() * 0.002 + phase);

      // Draw the rotating circle
      ctx.beginPath();
      ctx.arc(prevX, prevY, amp, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
      ctx.stroke();

      // Draw the connecting line
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.stroke();
    });

    // Draw the final trace point
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  };

  useEffect(() => {
    const interval = setInterval(draw, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [fourierTransform]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default FilePathDisplay;
