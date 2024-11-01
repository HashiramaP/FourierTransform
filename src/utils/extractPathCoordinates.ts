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
    console.log('points:', points);

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      // Handle relative and absolute commands
      switch (type) {
        case 'M':
        case 'm':
          currentX = type === 'M' ? x : currentX + x;
          currentY = type === 'M' ? y : currentY + y;
          coords.push({ x: currentX, y: currentY });
          break;
        case 'L':
        case 'l':
          currentX += type === 'L' ? x : x;
          currentY += type === 'L' ? y : y;
          coords.push({ x: currentX, y: currentY });
          break;
        case 'H':
        case 'h':
          currentX += type === 'H' ? x : x;
          coords.push({ x: currentX, y: currentY });
          break;
        case 'V':
        case 'v':
          currentY += type === 'V' ? y : y;
          coords.push({ x: currentX, y: currentY });
          break;
        case 'C':
        case 'c':
          if (i + 5 < points.length) {
            const cp1x = type === 'C' ? points[i] : points[i] + currentX;
            const cp1y =
              type === 'C' ? points[i + 1] : points[i + 1] + currentY;
            const cp2x =
              type === 'C' ? points[i + 2] : points[i + 2] + currentX;
            const cp2y =
              type === 'C' ? points[i + 3] : points[i + 3] + currentY;
            currentX += type === 'C' ? points[i + 4] : points[i + 4] + currentX;
            currentY += type === 'C' ? points[i + 5] : points[i + 5] + currentY;
            coords.push({ x: cp1x, y: cp1y });
            coords.push({ x: cp2x, y: cp2y });
            coords.push({ x: currentX, y: currentY });
            i += 5;
          }
          break;
        case 'Q':
        case 'q':
          if (i + 3 < points.length) {
            const cpx = type === 'Q' ? points[i] : points[i] + currentX;
            const cpy = type === 'Q' ? points[i + 1] : points[i + 1] + currentY;
            currentX += type === 'Q' ? points[i + 2] : points[i + 2] + currentX;
            currentY += type === 'Q' ? points[i + 3] : points[i + 3] + currentY;
            coords.push({ x: cpx, y: cpy });
            coords.push({ x: currentX, y: currentY });
            i += 3;
          }
          break;
        case 'A':
        case 'a':
          if (i + 6 < points.length) {
            // Push only the end point for simplicity
            currentX += type === 'A' ? points[i + 5] : points[i + 5] + currentX;
            currentY += type === 'A' ? points[i + 6] : points[i + 6] + currentY;
            coords.push({ x: currentX, y: currentY });
            i += 6;
          }
          break;
        default:
          break;
      }
    }
  });

  return coords;
};
export default extractPathCoordinates;
