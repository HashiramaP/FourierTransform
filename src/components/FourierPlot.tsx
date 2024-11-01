import React, { useEffect } from 'react';
import dft from '../utils/dft';
import extractPathCoordinates from '../utils/extractPathCoordinates';

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

  const { amplitude, phase } = dft(
    [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
      { x: 30, y: 0 },
      { x: 40, y: 0 },
      { x: 50, y: 0 },
    ],
    1,
  );
  return (
    <div>
      <p>
        Amp: {amplitude}
        Phase: {phase}
      </p>
    </div>
  );
};

export default FilePathDisplay;
