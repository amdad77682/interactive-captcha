import { Color, Sector, Shape } from '@/src/models/interface';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CaptchaContextType {
  // State
  target: { shape: Shape; color: Color } | null;
  selectedSectors: Set<number>;
  capturedImage: string | null;
  gridSectors: Sector[];

  // Setters
  setTarget: (target: { shape: Shape; color: Color } | null) => void;
  setSelectedSectors: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCapturedImage: (image: string | null) => void;
  setGridSectors: (sectors: Sector[]) => void;

  // Helper to toggle sector selection
  toggleSectorSelection: (sectorId: number) => void;

  // Reset function
  resetCaptchaState: () => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

export const CaptchaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* State to manage CAPTCHA-related data */
  const [target, setTarget] = useState<{ shape: Shape; color: Color } | null>(
    null
  );
  /* Using Set to manage selected sectors for efficient add/remove operations */
  const [selectedSectors, setSelectedSectors] = useState<Set<number>>(
    new Set()
  );
  /* State to hold the captured image from the camera */
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  /* State to hold the grid sectors information */
  const [gridSectors, setGridSectors] = useState<Sector[]>([]);

  /**
   * Toggle the selection state of a sector by its ID.
   * @param sectorId
   */
  const toggleSectorSelection = (sectorId: number) => {
    setSelectedSectors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectorId)) {
        newSet.delete(sectorId);
      } else {
        newSet.add(sectorId);
      }
      return newSet;
    });
  };
/**
 * Reset the CAPTCHA state to initial values.
 */
  const resetCaptchaState = () => {
    setTarget(null);
    setSelectedSectors(new Set());
    setCapturedImage(null);
    setGridSectors([]);
  };

  return (
    <CaptchaContext.Provider
      value={{
        target,
        selectedSectors,
        capturedImage,
        gridSectors,
        setTarget,
        setSelectedSectors,
        setCapturedImage,
        setGridSectors,
        toggleSectorSelection,
        resetCaptchaState,
      }}
    >
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptchaContext = () => {
  const context = useContext(CaptchaContext);
  if (context === undefined) {
    throw new Error('useCaptchaContext must be used within a CaptchaProvider');
  }
  return context;
};
