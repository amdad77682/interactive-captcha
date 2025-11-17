import { MAX_ATTEMPTS, USER_STATUS } from '@/src/models/constants';
import { useCaptchaContext } from '@/src/models/context/CaptchaContext';
import { useStepContext } from '@/src/models/context/StepContext';
import { CaptchaStep } from '@/src/models/interface';
import { useState } from 'react';

const useStepAndAttempt = () => {
  const { step, setStep, updateStep, canvasRef, setUserStatus } =
    useStepContext();
  // State to track the number of validation attempts remaining.
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  // A key to force re-mounting and resetting the Captcha component for a new attempt.
  const [captchaKey, setCaptchaKey] = useState<number>(Date.now());

  const { resetCaptchaState } = useCaptchaContext();

  /**
   * Resets the CAPTCHA for a new attempt.
   */
  const handleTryAgain = () => {
    setStep(CaptchaStep.Camera); // Reset to camera step
    resetCaptchaState(); // Clear global captcha state
    setCaptchaKey(Date.now()); // Change key to force re-render and reset state of Captcha component
    setUserStatus(USER_STATUS.pending);
  };
  return {
    updateStep,
    handleTryAgain,
    setAttemptsLeft,
    step,
    setStep,
    attemptsLeft,
    captchaKey,
    canvasRef,
  };
};

export default useStepAndAttempt;
