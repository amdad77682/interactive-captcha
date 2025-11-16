import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import { CaptchaStep } from '../interface';
import { USER_STATUS } from '../constants';

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
  const [step, setStep] = useState<CaptchaStep>(CaptchaStep.Camera);
  const [userStatus, setUserStatus] = useState<string>(USER_STATUS.pending);

  // Refs are stable across re-renders
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
