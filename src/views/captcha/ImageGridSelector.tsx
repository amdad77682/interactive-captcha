import { COLOR_CLASSES, GRID_SIZE, SHAPE_MAP } from '@/src/models/constants';
import { useCaptchaContext } from '@/src/models/context/CaptchaContext';
import { useSquareContext } from '@/src/models/context/SquareContext';

interface ImageGridCaptchaProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleValidate: () => void;
}

const ImageGridCaptchaSelector: React.FC<ImageGridCaptchaProps> = ({
  containerRef,
  handleValidate,
}) => {
  /* Access square position and size from SquareContext */
  const { squarePosition, squareSize } = useSquareContext();
  /* Access CAPTCHA context values and functions */
  const {
    target,
    selectedSectors,
    capturedImage,
    gridSectors,
    toggleSectorSelection,
  } = useCaptchaContext();

  const ShapeComponent = target ? SHAPE_MAP[target.shape] : null;
  const targetColorClass = target ? COLOR_CLASSES[target.color] : '';
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-4  text-center mb-4 p-4 rounded-lg">
        <p className="text-lg">Please select all sectors containing a:</p>
        <div className="flex items-center justify-center gap-3 ">
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
          className="absolute grid bg-gray-200/50"
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
                onClick={() => toggleSectorSelection(sector.id)}
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
          className="w-full uppercase bg-[#F5B427] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#D4A017] transition-colors"
        >
          Validate
        </button>
      </div>
    </div>
  );
};

export default ImageGridCaptchaSelector;
