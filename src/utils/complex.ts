export interface Point {
  x: number;
  y: number;
}

export interface ComplexExponential {
  amplitude: number;
  phase: number; // Phase in radians
}

export function complexToPolar(
  real: number,
  imaginary: number,
): ComplexExponential {
  const amplitude = Math.sqrt(real ** 2 + imaginary ** 2);
  const phase = Math.atan2(imaginary, real);

  return { amplitude, phase };
}

export function addComplexExponential(
  c1: ComplexExponential,
  c2: ComplexExponential,
): ComplexExponential {
  // Convert each complex number from polar to rectangular form
  const x1 = c1.amplitude * Math.cos(c1.phase);
  const y1 = c1.amplitude * Math.sin(c1.phase);
  const x2 = c2.amplitude * Math.cos(c2.phase);
  const y2 = c2.amplitude * Math.sin(c2.phase);

  // Add the real and imaginary parts
  const realSum = x1 + x2;
  const imagSum = y1 + y2;

  return complexToPolar(realSum, imagSum);
}
