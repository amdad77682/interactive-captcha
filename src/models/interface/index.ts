/**
 * Enum for the possible shapes of the watermarks.
 */
export enum Shape {
  Triangle = 'triangle',
  Square = 'square',
  Circle = 'circle',
}

/**
 * Enum for the possible color tints of the watermarks.
 */
export enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

/**
 * Represents the state of a single sector in the CAPTCHA grid.
 */
export interface Sector {
  id: number;
  shape: Shape | null;
  color: Color | null;
}

/**
 * Enum for the different steps in the CAPTCHA validation process.
 */
export enum CaptchaStep {
  Camera = 'camera',
  Grid = 'grid',
  Result = 'result',
}
