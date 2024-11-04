import { Point } from './complex';

export function interpolatePoints(points: Point[], d: number): Point[] {
  const interpolatedPoints: Point[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    // Calculate the distance between start and end
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the number of interpolation steps needed
    const steps = Math.ceil(distance / d);
    const stepX = dx / steps;
    const stepY = dy / steps;

    // Add interpolated points
    for (let j = 0; j < steps; j++) {
      interpolatedPoints.push({
        x: start.x + j * stepX,
        y: start.y + j * stepY,
      });
    }
  }

  // Add the last point to close the path
  interpolatedPoints.push(points[points.length - 1]);

  return interpolatedPoints;
}
