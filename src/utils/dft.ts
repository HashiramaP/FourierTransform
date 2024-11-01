import { type Point, type ComplexExponential } from './complex';

function dft(x: Point[], f: number): ComplexExponential {
  const T = x.length;
  const TWO_PI = 2 * Math.PI;

  let re = 0;
  let im = 0;

  for (let t = 0; t < T; t++) {
    const realPart = x[t].x;
    const imagPart = x[t].y;
    const phi = (TWO_PI * f * t) / T;

    re += realPart * Math.cos(phi) + imagPart * Math.sin(phi);
    im += -realPart * Math.sin(phi) + imagPart * Math.cos(phi);
  }

  re = re / T;
  im = im / T;

  const amplitude = Math.sqrt(re ** 2 + im ** 2);
  const phase = Math.atan2(im, re);

  console.log({ re, im, frequency: f, amplitude, phase });

  return { amplitude, phase };
}

export default dft;
