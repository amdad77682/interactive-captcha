import { useSquareContext } from '../shared/context/SquareContext';
import { useStepContext } from '../shared/context/StepContext';
import useCameraFeed from '../shared/hooks/useCameraFeed';
import useVideoCapture from '../shared/hooks/useVideoCapture';

interface CameraStreamProps {
  onValidate: (success: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ onValidate }) => {
  const { videoRef } = useStepContext();
  const { cameraError } = useCameraFeed();
  const { squarePosition, squareSize } = useSquareContext();

  const { containerRef, handleCapture } = useVideoCapture({ onValidate });
  // Refs for DOM elements

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
