import { RefObject, useCallback, useRef, useState } from 'react';
import {
  COLORS,
  GRID_SIZE,
  SHAPES,
  SQUARE_SIZE_PERCENT,
} from '../shared/constants';
import { CaptchaStep, Color, Sector, Shape } from '../shared/interface';

interface CameraStreamProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  updateStep: (step: CaptchaStep) => void;
  onValidate: (success: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({
  canvasRef,
  updateStep,
  onValidate,
}) => {
  // State for camera-related error messages.
  const [cameraError, setCameraError] = useState<string | null>(null);
  // State for the position of the moving square.
  const [squarePosition, setSquarePosition] = useState({ top: 10, left: 10 });
  // State to control whether the square is moving.
  const [isSquareMoving, setIsSquareMoving] = useState(true);
  // State for the grid sectors with their watermarks.
  const [gridSectors, setGridSectors] = useState<Sector[]>([]);
  // State for the challenge prompt (target shape and color).
  const [target, setTarget] = useState<{ shape: Shape; color: Color } | null>(
    null
  );
  // State to track which sectors the user has selected.
  const [selectedSectors, setSelectedSectors] = useState<Set<number>>(
    new Set()
  );
  // Refs for DOM elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const squareSize = containerRef.current
    ? Math.min(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      ) * SQUARE_SIZE_PERCENT
    : 200;

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
      //   setCapturedImage(canvas.toDataURL('image/jpeg'));
    }

    // generateGridChallenge();
    // setStep(CaptchaStep.Grid);
  }, [generateGridChallenge]);
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {cameraError && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-center p-4">
          <p className="text-red-400">{cameraError}</p>
        </div>
      )}
      <div
        className="absolute border-4 border-dashed border-yellow-400 transition-all duration-1000 ease-in-out"
        style={{
          width: `${squareSize}px`,
          height: `${squareSize}px`,
          top: `${squarePosition.top}px`,
          left: `${squarePosition.left}px`,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <button
          onClick={handleCapture}
          disabled={!!cameraError}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CameraStream;
