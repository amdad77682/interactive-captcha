'use client';
import { USER_STATUS } from '@/src/models/constants';
import { CaptchaProvider } from '@/src/models/context/CaptchaContext';
import { SquareProvider } from '@/src/models/context/SquareContext';
import { StepProvider, useStepContext } from '@/src/models/context/StepContext';
import Blocked from './Blocked';
import CaptchaSteps from './CaptchaSteps';
import Success from './Success';

const CaptchaContent: React.FC = () => {
  /* Access user status from StepContext */
  const { userStatus } = useStepContext();

  const renderContent = () => {
    /* Conditionally render components based on user status */
    switch (userStatus) {
      /* Render Success component if user status is success */
      case USER_STATUS.success:
        return <Success />;
      /* Render Blocked component if user status is blocked */
      case USER_STATUS.blocked:
        return <Blocked />;
      /* Default case: Render Captcha component */
      default:
        return <CaptchaSteps />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
      {renderContent()}
    </div>
  );
};

/* Main Captcha User Steps Component */
const CaptchaUserSteps: React.FC = () => {
  return (
    // Wrapping the CaptchaContent with necessary context providers
    <StepProvider>
      <SquareProvider>
        <CaptchaProvider>
          <CaptchaContent />
        </CaptchaProvider>
      </SquareProvider>
    </StepProvider>
  );
};

export default CaptchaUserSteps;
