import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SquareContextType {
  squareSize: number;
  squarePosition: { top: number; left: number };
  setSquareSize: (size: number) => void;
  setSquarePosition: (position: { top: number; left: number }) => void;
}

const SquareContext = createContext<SquareContextType | undefined>(undefined);

export const SquareProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [squareSize, setSquareSize] = useState<number>(200);
  const [squarePosition, setSquarePosition] = useState({ top: 10, left: 10 });

  return (
    <SquareContext.Provider
      value={{
        squareSize,
        squarePosition,
        setSquareSize,
        setSquarePosition,
      }}
    >
      {children}
    </SquareContext.Provider>
  );
};

export const useSquareContext = () => {
  const context = useContext(SquareContext);
  if (context === undefined) {
    throw new Error('useSquareContext must be used within a SquareProvider');
  }
  return context;
};
