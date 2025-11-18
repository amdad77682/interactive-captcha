import { Color, Shape } from '@/src/models/interface';
import { CircleIcon, SquareIcon, TriangleIcon } from 'lucide-react';
/* Maximum number of attempts allowed for CAPTCHA validation */
const MAX_ATTEMPTS = 3;
/* User status constants */
const USER_STATUS = {
  pending: 'pending',
  failed: 'failed',
  blocked: 'blocked',
  success: 'success',
};
/* Grid size for the image selection CAPTCHA */
const GRID_SIZE = 5; // Creates a 4x4 grid

/* Size percentage for the moving square in the CAPTCHA */
const SQUARE_SIZE_PERCENT = 0.8; 

/* Interval in milliseconds for moving the square */
const MOVE_INTERVAL_MS = 1500; 

/* Available shapes and colors for the CAPTCHA targets */
const SHAPES = [Shape.Triangle, Shape.Square, Shape.Circle];

/* Available colors for the CAPTCHA targets */
const COLORS = [Color.Red, Color.Green, Color.Blue];

/* Mapping of colors to their corresponding CSS classes */
const COLOR_CLASSES: Record<Color, string> = {
  [Color.Red]: 'text-red-500',
  [Color.Green]: 'text-green-500',
  [Color.Blue]: 'text-blue-500',
};

/* Mapping of shapes to their corresponding React components */
const SHAPE_MAP: Record<Shape, React.FC<{ className?: string }>> = {
  [Shape.Triangle]: TriangleIcon,
  [Shape.Square]: SquareIcon,
  [Shape.Circle]: CircleIcon,
};
export {
  COLOR_CLASSES,
  COLORS,
  GRID_SIZE,
  MAX_ATTEMPTS,
  MOVE_INTERVAL_MS,
  SHAPE_MAP,
  SHAPES,
  SQUARE_SIZE_PERCENT,
  USER_STATUS,
};
