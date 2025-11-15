import { useCallback, useRef, useState } from 'react';
import { MAX_ATTEMPTS, USER_STATUS } from '../shared/constants';
import { CaptchaStep } from '../shared/interface';
import CameraStream from './CameraStream';
import ImageGridCaptcha from './ImageGridCaptcha';

interface CaptchaProps {
  userStatus: string;
  setUserStatus: (status: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ userStatus, setUserStatus }) => {
  // State for the current step of the CAPTCHA process.
  const [step, setStep] = useState<CaptchaStep>(CaptchaStep.Camera);
  // State to track the number of validation attempts remaining.
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  // A key to force re-mounting and resetting the Captcha component for a new attempt.
  const [captchaKey, setCaptchaKey] = useState<number>(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    [attemptsLeft]
  );
  const updateStep = (newStep: CaptchaStep) => {
    setStep(newStep);
  };

  /**
   * Resets the CAPTCHA for a new attempt.
   */
  const handleTryAgain = () => {
    setCaptchaKey(Date.now()); // Change key to force re-render and reset state of Captcha component
  };

  const rederCaptchaStep = () => {
    switch (step) {
      case CaptchaStep.Camera:
        return (
          <CameraStream
            canvasRef={canvasRef}
            updateStep={updateStep}
            onValidate={handleValidate}
          />
        );
      case CaptchaStep.Grid:
        return <ImageGridCaptcha />;
      default:
        return null;
    }
  };
  // Camera step component goes here
  return (
    <div>
      <h1 className="font-bold text-xl">Take Selfie</h1>
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
