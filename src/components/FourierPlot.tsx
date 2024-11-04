// FilePathDisplay.tsx
import React, { useEffect } from 'react';
import extractPathCoordinates from '../utils/extractPathCoordinates';
import DFTCircleDisplay from './DFTCircleDisplay';
import { generateOvalPoints } from '../utils/dft';
import { interpolatePoints } from '../utils/interpolatedPoints';

interface FilePathDisplayProps {
  filePath: string;
}

const FilePathDisplay: React.FC<FilePathDisplayProps> = ({ filePath }) => {
  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await fetch(filePath);
        const text = await response.text();

        // Parse the SVG data as XML
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, 'image/svg+xml');

        // Extract coordinates from <path> elements
        const extractedCoordinates: string[] = [];
        const pathElements = svgDoc.querySelectorAll('path');

        pathElements.forEach(el => {
          const pathData = el.getAttribute('d') || '';
          const pathCoords = extractPathCoordinates(pathData);
          // Convert coordinates to complex number format and push to extractedCoordinates
          extractedCoordinates.push(
            ...pathCoords.map(coord => `${coord.x} + ${coord.y}i`),
          );
        });
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSVG();
  }, [filePath]);

  let points = [
    { x: -25, y: -25 }, // Bottom-left corner
    { x: 25, y: -25 }, // Bottom-right corner
    { x: 25, y: 25 }, // Top-right corner
    { x: -25, y: 25 }, // Top-left corner
    { x: -25, y: -25 }, // Closing back to the starting point
  ];

  const ovalPoints = generateOvalPoints(250, 250, 200, 100, 1000);

  //ovalPoints = interpolatePoints(ovalPoints, 0.1); // Interpolate points to ensure they are close together

  //points = interpolatePoints(points, 0.1); // Interpolate points to ensure they are close together

  const frequencies = Array.from({ length: 100 }, (_, i) => i + 1); // 10 frequencies

  return (
    <div>
      <DFTCircleDisplay points={ovalPoints} frequencies={frequencies} />
    </div>
  );
};

export default FilePathDisplay;
