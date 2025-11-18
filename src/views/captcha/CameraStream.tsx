import { useSquareContext } from '@/src/models/context/SquareContext';
import { useStepContext } from '@/src/models/context/StepContext';
import useCameraFeed from '@/src/viewmodels/useCameraFeed';
import useVideoCapture from '@/src/viewmodels/useVideoCapture';

interface CameraStreamProps {
  onValidate: (success: boolean) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ onValidate }) => {
  /* Access videoRef from StepContext */
  const { videoRef } = useStepContext();
  /* Custom hook to manage camera feed and errors */
  const { cameraError } = useCameraFeed();
  /* Access square position and size from SquareContext */
  const { squarePosition, squareSize } = useSquareContext();
  /* Custom hook to manage video capture */
  const { containerRef, handleCapture } = useVideoCapture({ onValidate });

  return (
    <>
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

        <div
          className="absolute border-4 border-dashed border-yellow-400 transition-all duration-1000 ease-in-out"
          style={{
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            top: `${squarePosition.top}px`,
            left: `${squarePosition.left}px`,
          }}
        />
      </div>
      <div className="p-4">
        <button
          onClick={handleCapture}
          disabled={!!cameraError}
          className="w-full uppercase bg-[#F5B427] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#D4A017] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default CameraStream;
