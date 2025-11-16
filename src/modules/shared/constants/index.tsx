import { CircleIcon, SquareIcon, TriangleIcon } from "lucide-react";
import { Color, Shape } from "../interface";

const MAX_ATTEMPTS = 3;
const USER_STATUS = {
  pending: 'pending',
  failed: 'failed',
  blocked: 'blocked',
  success: 'success',
};

const GRID_SIZE = 5; // Creates a 4x4 grid
const SQUARE_SIZE_PERCENT = 0.8; // The moving square will be 50% of the container's smaller dimension
const MOVE_INTERVAL_MS = 1500; // The square moves every 1.5 seconds

const SHAPES = [Shape.Triangle, Shape.Square, Shape.Circle];
const COLORS = [Color.Red, Color.Green, Color.Blue];

const COLOR_CLASSES: Record<Color, string> = {
  [Color.Red]: 'text-red-500',
  [Color.Green]: 'text-green-500',
  [Color.Blue]: 'text-blue-500',
};

const SHAPE_MAP: Record<Shape, React.FC<{ className?: string }>> = {
  [Shape.Triangle]: TriangleIcon,
  [Shape.Square]: SquareIcon,
  [Shape.Circle]: CircleIcon,
};
export { MAX_ATTEMPTS, MOVE_INTERVAL_MS, SQUARE_SIZE_PERCENT, USER_STATUS , GRID_SIZE, SHAPES, COLORS, COLOR_CLASSES, SHAPE_MAP };
