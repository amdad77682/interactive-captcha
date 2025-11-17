import { COLORS, GRID_SIZE, SHAPES } from '@/src/models/constants';
import { useCaptchaContext } from '@/src/models/context/CaptchaContext';
import { useStepContext } from '@/src/models/context/StepContext';
import { CaptchaStep, Color, Shape } from '@/src/models/interface';
import { useCallback } from 'react';
import useSquareRandomMove from './useSquareRandomMove';

interface UseVideoCaptureProps {
  onValidate: (success: boolean) => void;
}
const useVideoCapture = ({ onValidate }: UseVideoCaptureProps) => {
  const { videoRef, canvasRef, updateStep } = useStepContext();
  const { containerRef, setIsSquareMoving } = useSquareRandomMove();

  // Use global context for shared state
  const {
    gridSectors,
    setGridSectors,
    target,
    setTarget,
    setCapturedImage,
    selectedSectors,
  } = useCaptchaContext();

  /**
   * Handles the "Validate" button click. Checks the user's selection against the correct answer.
   */
  const handleValidate = () => {
    if (!target) return;

    // Find all sectors that correctly match the target shape and color
    const correctSectors = new Set(
      gridSectors
        .filter(s => s.shape === target.shape && s.color === target.color)
        .map(s => s.id)
    );

    // Check if the user's selection is identical to the set of correct sectors
    const isSuccess =
      selectedSectors.size === correctSectors.size &&
      [...selectedSectors].every(id => correctSectors.has(id));

    updateStep(CaptchaStep.Result);
    onValidate(isSuccess);
  };

  /**
   * Generates the CAPTCHA grid challenge after the image is captured.
   */
  const generateGridChallenge = useCallback(() => {
    const totalSectors = GRID_SIZE * GRID_SIZE;
    const sectorsWithWatermarks = Math.floor(totalSectors / 2);

    const allIndices = Array.from({ length: totalSectors }, (_, i) => i);
    // Shuffle indices to randomly select sectors for watermarks
    for (let i = totalSectors - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
    }
    const watermarkIndices = new Set(
      allIndices.slice(0, sectorsWithWatermarks)
    );

    const usedWatermarks: { shape: Shape; color: Color }[] = [];

    const newSectors = allIndices.map(id => {
      if (watermarkIndices.has(id)) {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        usedWatermarks.push({ shape, color });
        return { id, shape, color };
      }
      return { id, shape: null, color: null };
    });

    setGridSectors(newSectors);

    // Select a random watermark that was actually used as the target
    if (usedWatermarks.length > 0) {
      const randomTarget =
        usedWatermarks[Math.floor(Math.random() * usedWatermarks.length)];
      setTarget(randomTarget);
    } else {
      // Fallback in case no watermarks are generated, though this is unlikely
      handleValidate();
    }
  }, []);
  /**
   * Handles the "Continue" button click. Captures the camera frame and moves to the grid step.
   */
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !containerRef.current)
      return;

    setIsSquareMoving(false); // Stop the square

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const { clientWidth, clientHeight } = containerRef.current;

    // Set canvas dimensions to match the display size of the container
    canvas.width = clientWidth;
    canvas.height = clientHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw the current video frame onto the canvas
      // This scales the video to fit the container size, preserving aspect ratio
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const canvasAspectRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight, x, y;

      if (videoAspectRatio > canvasAspectRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * videoAspectRatio;
        x = (canvas.width - drawWidth) / 2;
        y = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / videoAspectRatio;
        x = 0;
        y = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(video, x, y, drawWidth, drawHeight);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    }

    generateGridChallenge();
    updateStep(CaptchaStep.Grid);
  }, [generateGridChallenge, updateStep]);

  /**
   * Creates a validation handler that can be passed to components
   */
  const createValidateHandler = useCallback(() => {
    if (!target) return;

    // Find all sectors that correctly match the target shape and color
    const correctSectors = new Set(
      gridSectors
        .filter(s => s.shape === target.shape && s.color === target.color)
        .map(s => s.id)
    );

    // Check if the user's selection is identical to the set of correct sectors
    const isSuccess =
      selectedSectors.size === correctSectors.size &&
      [...selectedSectors].every(id => correctSectors.has(id));

    updateStep(CaptchaStep.Result);
    onValidate(isSuccess);
  }, [target, gridSectors, selectedSectors, updateStep, onValidate]);

  return {
    containerRef,
    handleCapture,
    handleValidate: createValidateHandler,
  };
};

export default useVideoCapture;
