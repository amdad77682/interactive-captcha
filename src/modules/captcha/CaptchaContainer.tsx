'use client';
import { useState } from 'react';
import { USER_STATUS } from '../shared/constants';
import { CaptchaProvider } from '../shared/context/CaptchaContext';
import { SquareProvider } from '../shared/context/SquareContext';
import { StepProvider } from '../shared/context/StepContext';
import Blocked from './Blocked';
import Captcha from './Captcha';
import Success from './Success';
const CaptchaContainer: React.FC = () => {
  // State to determine the user status.
  const [userStatus, setUserStatus] = useState<string>(USER_STATUS?.pending);

  const renderContent = () => {
    /* Conditionally render components based on user status */
    switch (userStatus) {
      case USER_STATUS.success:
        return <Success />;
      case USER_STATUS.blocked:
        return <Blocked />;
      default:
        return (
          <Captcha userStatus={userStatus} setUserStatus={setUserStatus} />
        );
    }
  };
  return (
    <StepProvider>
      <SquareProvider>
        <CaptchaProvider>
          <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
            {renderContent()}
          </div>
        </CaptchaProvider>
      </SquareProvider>
    </StepProvider>
  );
};

export default CaptchaContainer;
