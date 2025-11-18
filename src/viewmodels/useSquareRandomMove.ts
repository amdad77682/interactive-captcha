import { MOVE_INTERVAL_MS, SQUARE_SIZE_PERCENT } from '@/src/models/constants';
import { useSquareContext } from '@/src/models/context/SquareContext';
import { CaptchaStep } from '@/src/models/interface';
import { useEffect, useRef, useState } from 'react';
import { useStepContext } from '../models/context/StepContext';

const useSquareRandomMove = () => {
  // State to control whether the square is moving.
  const [isSquareMoving, setIsSquareMoving] = useState(true);
  // Get the current CAPTCHA step from context.
  const { step } = useStepContext();

  // Get functions to set square position and size from SquareContext.
  const { setSquarePosition, setSquareSize } = useSquareContext();

  const containerRef = useRef<HTMLDivElement>(null);

  // Update square size when container is available
  useEffect(() => {
    if (containerRef.current) {
      const newSize =
        Math.min(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        ) * SQUARE_SIZE_PERCENT;
      setSquareSize(newSize);
    }
  }, [setSquareSize]);

  /**
   * Manages the movement of the square overlay on the video feed.
   */
  useEffect(() => {
    if (!isSquareMoving || step !== CaptchaStep.Camera) {
      return;
    }

    const intervalId = setInterval(() => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const squareSize =
          Math.min(clientWidth, clientHeight) * SQUARE_SIZE_PERCENT;
        const maxX = clientWidth - squareSize;
        const maxY = clientHeight - squareSize;
        setSquarePosition({
          top: Math.random() * maxY,
          left: Math.random() * maxX,
        });
      }
    }, MOVE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isSquareMoving, step, setSquarePosition]);
  return {
    containerRef,
    setIsSquareMoving,
  };
};

export default useSquareRandomMove;
