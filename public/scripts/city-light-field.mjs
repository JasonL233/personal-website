// Shared transfer curve for GPU emission and CPU tree-light sampling.
// NASA's display-mapped grayscale is not calibrated physical radiance.
export const CITY_NOISE_FLOOR = .012;
export const CITY_NOISE_CEILING = .055;
export const CITY_GAMMA = .82;
export const CITY_TRANSFER_GLSL = `pow(observed, ${CITY_GAMMA}) * smoothstep(${CITY_NOISE_FLOOR}, ${CITY_NOISE_CEILING}, observed)`;

export function cityIntensity(observed) {
  const value = Math.max(0, Math.min(1, observed));
  const t = Math.max(0, Math.min(1, (value - CITY_NOISE_FLOOR) / (CITY_NOISE_CEILING - CITY_NOISE_FLOOR)));
  return value ** CITY_GAMMA * t * t * (3 - 2 * t);
}

// v starts at the north edge of the image; GLSL uses the flipped texture v.
export function geographicUV(x, y, z) {
  const length = Math.hypot(x, y, z);
  const longitude = Math.atan2(-z, x) + 125 * Math.PI / 180;
  return [((longitude / (Math.PI * 2) + .5) % 1 + 1) % 1, .5 - Math.asin(Math.max(-1, Math.min(1, y / length))) / Math.PI];
}

export function sampleCityLight(data, width, height, u, v) {
  const x = ((u % 1 + 1) % 1) * width - .5;
  const y = Math.max(0, Math.min(height - 1, v * height - .5));
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const pixel = (px, py) => data[(py * width + (px % width + width) % width) * 4] / 255;
  const a = pixel(x0, y0) * (1 - fx) + pixel(x0 + 1, y0) * fx;
  const b = pixel(x0, Math.min(y0 + 1, height - 1)) * (1 - fx) + pixel(x0 + 1, Math.min(y0 + 1, height - 1)) * fx;
  return cityIntensity(a * (1 - fy) + b * fy);
}
