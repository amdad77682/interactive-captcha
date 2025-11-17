import { useCaptchaContext } from '@/src/models/context/CaptchaContext';

const useCaptchaSelector = () => {
  const {
    target,
    selectedSectors,
    capturedImage,
    gridSectors,
    toggleSectorSelection,
  } = useCaptchaContext();

  return {
    target,
    selectedSectors,
    capturedImage,
    gridSectors,
    toggleSectorSelection,
  };
};

export default useCaptchaSelector;
