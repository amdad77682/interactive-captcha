'use client';
import { USER_STATUS } from '@/src/models/constants';
import { CaptchaProvider } from '@/src/models/context/CaptchaContext';
import { SquareProvider } from '@/src/models/context/SquareContext';
import { StepProvider, useStepContext } from '@/src/models/context/StepContext';
import Blocked from './Blocked';
import Captcha from './CaptchaSteps';
import Success from './Success';

const CaptchaContent: React.FC = () => {
  const { userStatus } = useStepContext();

  const renderContent = () => {
    /* Conditionally render components based on user status */
    switch (userStatus) {
      case USER_STATUS.success:
        return <Success />;
      case USER_STATUS.blocked:
        return <Blocked />;
      default:
        return <Captcha />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
      {renderContent()}
    </div>
  );
};

const CaptchaContainer: React.FC = () => {
  return (
    <StepProvider>
      <SquareProvider>
        <CaptchaProvider>
          <CaptchaContent />
        </CaptchaProvider>
      </SquareProvider>
    </StepProvider>
  );
};

export default CaptchaContainer;
