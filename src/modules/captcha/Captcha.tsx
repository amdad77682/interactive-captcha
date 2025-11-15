import { useCallback } from 'react';
import { MAX_ATTEMPTS, USER_STATUS } from '../shared/constants';
import useCameraFeed from '../shared/hooks/useCameraFeed';
import useStepAndAttempt from '../shared/hooks/useStepAndAttempt';
import useVideoCapture from '../shared/hooks/useVideoCapture';
import { CaptchaStep } from '../shared/interface';
import CameraStream from './CameraStream';
import ImageGridCaptchaSelector from './ImageGridSelector';

interface CaptchaProps {
  userStatus: string;
  setUserStatus: (status: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ userStatus, setUserStatus }) => {
  const {
    updateStep,
    handleTryAgain,
    step,
    attemptsLeft,
    setAttemptsLeft,
    canvasRef,
  } = useStepAndAttempt();

  useCameraFeed();

  /**
   * Callback function triggered when the CAPTCHA validation is complete.
   * @param {boolean} success - Indicates whether the validation was successful.
   */
  const handleValidate = useCallback(
    (success: boolean) => {
      if (success) {
        setUserStatus(USER_STATUS.success);
      } else {
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);
        if (newAttemptsLeft <= 0) {
          setUserStatus(USER_STATUS.blocked);
        }
      }
    },
    [attemptsLeft, setUserStatus, setAttemptsLeft]
  );

  const {
    containerRef,
    handleCapture,
    handleValidate: handleCaptchaValidation,
  } = useVideoCapture({ onValidate: handleValidate });

  const rederCaptchaStep = () => {
    switch (step) {
      case CaptchaStep.Camera:
        return <CameraStream onValidate={handleValidate} />;
      case CaptchaStep.Grid:
        return (
          <ImageGridCaptchaSelector
            containerRef={containerRef}
            handleValidate={handleCaptchaValidation}
          />
        );
      default:
        return null;
    }
  };
  // Camera step component goes here
  return (
    <div>
      <h1 className="font-bold text-xl text-center py-4">Take Selfie</h1>
      {attemptsLeft < MAX_ATTEMPTS && userStatus !== USER_STATUS.success && (
        <div className="mb-4 text-center p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="font-bold text-red-400">
            Validation failed. Please try again.
          </p>
          <p className="text-sm text-gray-400">
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'}{' '}
            remaining.
          </p>
          <button
            onClick={handleTryAgain}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <canvas ref={canvasRef} className="hidden" />
        {rederCaptchaStep()}
      </div>
    </div>
  );
};

export default Captcha;
