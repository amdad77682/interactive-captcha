import { useStepContext } from '@/src/models/context/StepContext';
import { useEffect, useState } from 'react';

const useCameraFeed = () => {
  const { videoRef } = useStepContext();
  // State for camera-related error messages.
  const [cameraError, setCameraError] = useState<string | null>(null);
  /**
   * Initializes the camera feed when the component mounts.
   */
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError(
          'Could not access the camera. Please grant permission and refresh the page.'
        );
      }
    };
    enableCamera();

    // Cleanup function to stop the camera stream when the component unmounts.
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [videoRef]);
  return {
    cameraError,
  };
};

export default useCameraFeed;
