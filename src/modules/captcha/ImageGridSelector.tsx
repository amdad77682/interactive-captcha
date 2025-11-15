import { COLOR_CLASSES, GRID_SIZE, SHAPE_MAP } from '../shared/constants';
import { useSquareContext } from '../shared/context/SquareContext';
import useCaptchaSelector from '../shared/hooks/useCaptchaSelector';

interface ImageGridCaptchaProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleValidate: () => void;
}

const ImageGridCaptchaSelector: React.FC<ImageGridCaptchaProps> = ({
  containerRef,
  handleValidate,
}) => {
  const { squarePosition, squareSize } = useSquareContext();
  const {
    target,
    selectedSectors,
    capturedImage,
    gridSectors,
    toggleSectorSelection,
  } = useCaptchaSelector();

  const ShapeComponent = target ? SHAPE_MAP[target.shape] : null;
  const targetColorClass = target ? COLOR_CLASSES[target.color] : '';

  const handleSelectSector = (sectorId: number) => {
    toggleSectorSelection(sectorId);
  };
  return (
    <div className="flex flex-col">
      <div className="text-center mb-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-lg text-gray-300">
          Please select all sectors containing a:
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          {target && ShapeComponent && (
            <ShapeComponent
              className={`w-8 h-8 fill-current ${targetColorClass}`}
            />
          )}
          <span className={`text-2xl font-bold capitalize ${targetColorClass}`}>
            {target?.color} {target?.shape}
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
      >
        {capturedImage && (
          <img
            src={capturedImage}
            alt="captured frame"
            className="w-full h-full object-cover"
          />
        )}
        <div
          className="absolute grid"
          style={{
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            top: `${squarePosition.top}px`,
            left: `${squarePosition.left}px`,
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {gridSectors.map(sector => {
            const SectorShapeComponent = sector.shape
              ? SHAPE_MAP[sector.shape]
              : null;
            return (
              <div
                key={sector.id}
                onClick={() => handleSelectSector(sector.id)}
                className={`border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedSectors.has(sector.id) ? 'bg-blue-500/50' : 'bg-transparent hover:bg-white/20'}`}
              >
                {SectorShapeComponent && sector.color && (
                  <SectorShapeComponent
                    className={`w-3/4 h-3/4 opacity-50 fill-current ${COLOR_CLASSES[sector.color]}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleValidate}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Validate
        </button>
      </div>
    </div>
  );
};

export default ImageGridCaptchaSelector;
