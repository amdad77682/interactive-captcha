import { MAX_ATTEMPTS, USER_STATUS } from '@/src/models/constants';
import { useStepContext } from '@/src/models/context/StepContext';
import { CaptchaStep } from '@/src/models/interface';
import useCameraFeed from '@/src/viewmodels/useCameraFeed';
import useStepAndAttempt from '@/src/viewmodels/useStepAndAttempt';
import useVideoCapture from '@/src/viewmodels/useVideoCapture';
import { TriangleAlert } from 'lucide-react';
import { useCallback } from 'react';
import CameraStream from './CameraStream';
import ImageGridCaptchaSelector from './ImageGridSelector';

const Captcha: React.FC = () => {
  const { userStatus, setUserStatus } = useStepContext();
  const { handleTryAgain, step, attemptsLeft, setAttemptsLeft, canvasRef } =
    useStepAndAttempt();
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
        } else {
          setUserStatus(USER_STATUS.failed);
        }
      }
    },
    [attemptsLeft, setUserStatus, setAttemptsLeft]
  );

  const { containerRef, handleValidate: handleCaptchaValidation } =
    useVideoCapture({ onValidate: handleValidate });

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
      <h1 className="font-bold text-xl text-center py-4">
        {step == CaptchaStep.Camera
          ? 'Take Selfie'
          : step == CaptchaStep.Grid
            ? 'Select shape'
            : ''}
      </h1>
      {attemptsLeft < MAX_ATTEMPTS && userStatus == USER_STATUS.failed && (
        <div className="mb-4 text-center p-4  rounded-lg">
          <TriangleAlert size={80} className="mx-auto mb-2 text-red-400 " />
          <p className="font-bold text-lg text-red-400">
            Validation failed. Please try again.
          </p>
          <p className="text-sm py-2">
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'}{' '}
            remaining.
          </p>
          <button
            onClick={handleTryAgain}
            className="w-full uppercase bg-[#F5B427] mt-2 px-4 py-2 text-white rounded-md hover:bg-[#D4A017] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {userStatus === USER_STATUS.pending && (
        <div>
          <canvas ref={canvasRef} className="hidden" />
          {rederCaptchaStep()}
        </div>
      )}
    </div>
  );
};

export default Captcha;
