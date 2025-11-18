import { USER_STATUS } from '@/src/models/constants';
import { CaptchaStep } from '@/src/models/interface';
import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useRef,
  useState,
} from 'react';

interface StepContextType {
  step: CaptchaStep;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  userStatus: string;
  setStep: (step: CaptchaStep) => void;
  updateStep: (step: CaptchaStep) => void;
  setUserStatus: (status: string) => void;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export const StepProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* State to manage current CAPTCHA step */
  const [step, setStep] = useState<CaptchaStep>(CaptchaStep.Camera);
  /* State to manage user status */
  const [userStatus, setUserStatus] = useState<string>(USER_STATUS.pending);

  /* Refs for video elements */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /* Ref for canvas element */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Update the current step of the CAPTCHA process.
   * @param newStep The new step to update to
   */
  const updateStep = (newStep: CaptchaStep) => {
    setStep(newStep);
  };

  return (
    <StepContext.Provider
      value={{
        step,
        videoRef,
        canvasRef,
        userStatus,
        setStep,
        updateStep,
        setUserStatus,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStepContext = () => {
  const context = useContext(StepContext);
  if (context === undefined) {
    throw new Error('useStepContext must be used within a StepProvider');
  }
  return context;
};
