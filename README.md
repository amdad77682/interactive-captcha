# Interactive CAPTCHA - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [State Management](#state-management)
6. [Context APIs](#context-apis)
7. [Custom Hooks](#custom-hooks)
8. [Components](#components)
9. [Constants & Types](#constants--types)
10. [How It Works](#how-it-works)
11. [Package Dependencies](#package-dependencies)

---

## Project Overview

An interactive CAPTCHA system that combines camera-based verification with visual pattern recognition. Users must:

1. Position their face within a moving square overlay on a live camera feed
2. Identify and select grid sectors containing specific colored shapes (watermarks)

This creates a multi-layered verification system that's difficult for bots to bypass while maintaining user-friendliness.

---

## Technology Stack

- **Framework**: Next.js 16.0.3 (React 19.2.0)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Icons**: Lucide React
- **Build Tool**: Next.js built-in compiler
- **Package Manager**: npm

---

## Project Structure

```
interactive-captcha-meldcx/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main entry point
│   └── globals.css              # Global styles
├── src/
│   └── modules/
│       ├── captcha/             # CAPTCHA UI components
│       │   ├── Blocked.tsx      # Blocked state screen
│       │   ├── CameraStream.tsx # Camera feed with overlay
│       │   ├── Captcha.tsx      # Main orchestrator component
│       │   ├── CaptchaContainer.tsx  # Root container with providers
│       │   ├── ImageGridSelector.tsx # Grid selection interface
│       │   └── Success.tsx      # Success state screen
│       └── shared/              # Shared resources
│           ├── constants/       # Configuration values
│           │   └── index.tsx
│           ├── context/         # React Context providers
│           │   ├── CaptchaContext.tsx   # CAPTCHA data state
│           │   ├── SquareContext.tsx    # Moving square state
│           │   └── StepContext.tsx      # Step & refs state
│           ├── hooks/           # Custom React hooks
│           │   ├── useCameraFeed.ts         # Camera initialization
│           │   ├── useCaptchaSelector.ts    # Grid selection logic
│           │   ├── useSquareRandomMove.ts   # Square movement
│           │   ├── useStepAndAttempt.ts     # Step & attempt management
│           │   └── useVideoCapture.ts       # Video frame capture
│           └── interface/       # TypeScript types
│               └── index.ts
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── tailwind.config.ts          # Tailwind config
```

---

## Architecture & Design Patterns

### 1. **Provider Pattern (Context API)**

The application uses React Context API extensively to avoid prop drilling and provide global state management.

**Implementation:**

- Three separate contexts for different concerns (Separation of Concerns principle)
- Provider composition in `CaptchaContainer`
- Custom hooks for consuming contexts

**Benefits:**

- Clean component APIs (no excessive prop passing)
- Centralized state management
- Easy state sharing across component tree
- Type-safe with TypeScript

### 2. **Custom Hooks Pattern**

Business logic is extracted into reusable custom hooks.

**Examples:**

- `useCameraFeed`: Encapsulates camera initialization and cleanup
- `useVideoCapture`: Handles frame capture and grid generation
- `useSquareRandomMove`: Manages square animation logic

**Benefits:**

- Separation of concerns
- Reusability
- Testability
- Cleaner components (focus on UI)

### 3. **Component Composition Pattern**

Small, focused components composed together to create complex UIs.

**Example:**

```
CaptchaContainer
  └── StepProvider
      └── SquareProvider
          └── CaptchaProvider
              └── CaptchaContent
                  └── Captcha
                      ├── CameraStream
                      └── ImageGridSelector
```

### 4. **Container/Presenter Pattern**

- **Containers** (`Captcha.tsx`): Manage state and logic
- **Presenters** (`CameraStream.tsx`, `ImageGridSelector.tsx`): Display UI

### 5. **State Machine Pattern**

The CAPTCHA flow follows a finite state machine:

```
pending → Camera Step → Grid Step → Result → (success/blocked/retry)
```

Controlled by `CaptchaStep` enum and managed in `StepContext`.

### 6. **Strategy Pattern**

Different validation strategies based on user attempts:

- Success: Grant access
- Failure with attempts left: Allow retry
- Max attempts reached: Block user

### 7. **Observer Pattern (React Refs)**

Refs observe DOM elements without causing re-renders:

- `videoRef`: Monitors video element
- `canvasRef`: Monitors canvas element
- `containerRef`: Monitors container dimensions

### 8. **Factory Pattern**

Grid generation uses a factory-like approach:

```typescript
const newSectors = allIndices.map(id => {
  if (watermarkIndices.has(id)) {
    return { id, shape, color }; // Create watermarked sector
  }
  return { id, shape: null, color: null }; // Create empty sector
});
```

---

## State Management

### Global State Architecture

The application uses a **three-tier context system**:

```
┌─────────────────────────────────────────┐
│         StepContext (Outer)             │
│  - step, userStatus                     │
│  - videoRef, canvasRef                  │
│  ┌───────────────────────────────────┐  │
│  │    SquareContext (Middle)         │  │
│  │  - squareSize, squarePosition     │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   CaptchaContext (Inner)    │  │  │
│  │  │  - target, gridSectors      │  │  │
│  │  │  - selectedSectors          │  │  │
│  │  │  - capturedImage            │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Why Three Separate Contexts?

1. **Separation of Concerns**: Each context manages a distinct domain
2. **Performance**: Components only re-render when their specific context changes
3. **Reusability**: Contexts can be used independently
4. **Clarity**: Clear ownership of state

---

## Context APIs

### 1. StepContext

**Purpose**: Manages CAPTCHA flow, user status, and DOM references

**State:**

```typescript
{
  step: CaptchaStep; // Current CAPTCHA step
  userStatus: string; // 'pending' | 'success' | 'blocked'
  videoRef: RefObject<HTMLVideoElement>; // Camera video element
  canvasRef: RefObject<HTMLCanvasElement>; // Capture canvas element
}
```

**Methods:**

- `setStep(step)`: Update current step
- `updateStep(step)`: Alias for setStep
- `setUserStatus(status)`: Update user verification status

**Usage:**

```typescript
const { step, videoRef, userStatus, setUserStatus } = useStepContext();
```

**Why it exists:**

- Centralizes flow control
- Prevents ref duplication (memory leak prevention)
- Manages user verification state globally

---

### 2. SquareContext

**Purpose**: Manages the moving square overlay animation

**State:**

```typescript
{
  squareSize: number; // Square dimensions in pixels
  squarePosition: {
    top: number;
    left: number;
  } // Position coordinates
}
```

**Methods:**

- `setSquareSize(size)`: Update square size
- `setSquarePosition(position)`: Update square position

**Usage:**

```typescript
const { squareSize, squarePosition, setSquarePosition } = useSquareContext();
```

**Why it exists:**

- Separates animation state from business logic
- Allows multiple components to read square position (Camera + Grid)
- Prevents unnecessary re-renders in unrelated components

---

### 3. CaptchaContext

**Purpose**: Manages CAPTCHA challenge data and user interactions

**State:**

```typescript
{
  target: { shape: Shape; color: Color } | null;  // Challenge target
  selectedSectors: Set<number>;                   // User's selections
  capturedImage: string | null;                   // Base64 image data
  gridSectors: Sector[];                          // Grid configuration
}
```

**Methods:**

- `setTarget(target)`: Set challenge target
- `setSelectedSectors(sectors)`: Update selections
- `setCapturedImage(image)`: Store captured frame
- `setGridSectors(sectors)`: Set grid layout
- `toggleSectorSelection(id)`: Toggle sector selection
- `resetCaptchaState()`: Reset all CAPTCHA data

**Usage:**

```typescript
const { target, gridSectors, toggleSectorSelection } = useCaptchaContext();
```

**Why it exists:**

- Centralizes CAPTCHA challenge data
- Provides atomic operations (toggleSectorSelection)
- Enables easy state reset between attempts

---

## Custom Hooks

### 1. useCameraFeed

**File**: `src/modules/shared/hooks/useCameraFeed.ts`

**Purpose**: Initialize and manage camera stream

**Returns:**

```typescript
{
  cameraError: string | null; // Error message if camera fails
}
```

**Lifecycle:**

1. Requests camera permission on mount
2. Attaches stream to videoRef from StepContext
3. Handles errors (permissions, device unavailability)
4. Cleans up stream on unmount

**Key Logic:**

```typescript
useEffect(() => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = stream;

  return () => {
    stream.getTracks().forEach(track => track.stop());
  };
}, [videoRef]);
```

---

### 2. useSquareRandomMove

**File**: `src/modules/shared/hooks/useSquareRandomMove.ts`

**Purpose**: Animate moving square overlay

**Parameters:**

- `step`: Current CaptchaStep (only moves during Camera step)

**Returns:**

```typescript
{
  containerRef: RefObject<HTMLDivElement>;
  setIsSquareMoving: (moving: boolean) => void;
}
```

**Key Logic:**

- Uses `setInterval` to move square every 1.5 seconds
- Calculates random positions within container bounds
- Updates SquareContext with new positions
- Automatically stops when step changes or component unmounts

**Algorithm:**

```typescript
const maxX = containerWidth - squareSize;
const maxY = containerHeight - squareSize;
setSquarePosition({
  top: Math.random() * maxY,
  left: Math.random() * maxX,
});
```

---

### 3. useVideoCapture

**File**: `src/modules/shared/hooks/useVideoCapture.ts`

**Purpose**: Capture camera frame and generate CAPTCHA grid

**Parameters:**

- `onValidate`: Callback for validation results

**Returns:**

```typescript
{
  containerRef: RefObject<HTMLDivElement>;
  handleCapture: () => void;
  handleValidate: () => void;
}
```

**Key Responsibilities:**

1. **Frame Capture:**

```typescript
const canvas = canvasRef.current;
canvas.width = containerWidth;
canvas.height = containerHeight;
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
const imageData = canvas.toDataURL('image/jpeg');
```

2. **Grid Generation:**

```typescript
// Create 5x5 grid (25 sectors)
// Randomly place watermarks in ~50% of sectors
// Select random target from placed watermarks
```

3. **Validation:**

```typescript
// Find all sectors matching target shape+color
// Compare with user's selection
// Call onValidate callback with result
```

---

### 4. useStepAndAttempt

**File**: `src/modules/shared/hooks/useStepAndAttempt.ts`

**Purpose**: Manage CAPTCHA flow and retry attempts

**Returns:**

```typescript
{
  step: CaptchaStep;
  attemptsLeft: number;
  canvasRef: RefObject<HTMLCanvasElement>;
  updateStep: (step: CaptchaStep) => void;
  setAttemptsLeft: (attempts: number) => void;
  handleTryAgain: () => void;
}
```

**Key Features:**

- Tracks remaining attempts (MAX_ATTEMPTS = 3)
- Provides reset functionality
- Integrates with StepContext and CaptchaContext

**Reset Logic:**

```typescript
const handleTryAgain = () => {
  setStep(CaptchaStep.Camera); // Reset to camera
  resetCaptchaState(); // Clear CAPTCHA data
  setCaptchaKey(Date.now()); // Force re-render
};
```

---

### 5. useCaptchaSelector

**File**: `src/modules/shared/hooks/useCaptchaSelector.ts`

**Purpose**: Provide CAPTCHA state for grid selection UI

**Returns:**

```typescript
{
  target: { shape: Shape; color: Color } | null;
  selectedSectors: Set<number>;
  capturedImage: string | null;
  gridSectors: Sector[];
  toggleSectorSelection: (id: number) => void;
}
```

**Usage:**
Convenience hook that wraps `useCaptchaContext()` for the ImageGridSelector component.

---

## Components

### CaptchaContainer

**File**: `src/modules/captcha/CaptchaContainer.tsx`

**Purpose**: Root component with provider composition

**Structure:**

```tsx
<StepProvider>
  <SquareProvider>
    <CaptchaProvider>
      <CaptchaContent />
    </CaptchaProvider>
  </SquareProvider>
</StepProvider>
```

**Responsibilities:**

- Initialize all contexts
- Route to appropriate screen based on userStatus
- Maintain proper provider hierarchy

---

### Captcha

**File**: `src/modules/captcha/Captcha.tsx`

**Purpose**: Main orchestrator component

**State Flow:**

```typescript
const handleValidate = (success: boolean) => {
  if (success) {
    setUserStatus(USER_STATUS.success);
  } else {
    attemptsLeft--;
    if (attemptsLeft <= 0) {
      setUserStatus(USER_STATUS.blocked);
    }
  }
};
```

**Renders:**

- Attempt counter
- Retry button (after failure)
- Canvas element (hidden, used for capture)
- Current step component (CameraStream or ImageGridSelector)

---

### CameraStream

**File**: `src/modules/captcha/CameraStream.tsx`

**Purpose**: Display camera feed with moving square

**UI Elements:**

1. Video element (camera feed)
2. Animated square overlay
3. Error message (if camera fails)
4. Continue button

**Visual Hierarchy:**

```
┌─────────────────────────┐
│   Camera Video Feed     │
│                         │
│    ┏━━━━━━━━┓          │
│    ┃ Square ┃          │
│    ┗━━━━━━━━┛          │
│                         │
│  [Continue Button]      │
└─────────────────────────┘
```

---

### ImageGridSelector

**File**: `src/modules/captcha/ImageGridSelector.tsx`

**Purpose**: Display captured image with selectable grid

**Layout:**

```
┌───────────────────────────────┐
│ Select all: Red Triangle      │
├───────────────────────────────┤
│  ┌─────────────────────────┐  │
│  │   Captured Image        │  │
│  │   ┌─┬─┬─┬─┬─┐          │  │
│  │   ├─┼─┼─┼─┼─┤ (5x5 grid)│  │
│  │   ├─┼─┼─┼─┼─┤          │  │
│  │   ├─┼─┼─┼─┼─┤          │  │
│  │   └─┴─┴─┴─┴─┘          │  │
│  └─────────────────────────┘  │
│     [Validate Button]         │
└───────────────────────────────┘
```

**Interaction:**

- Click sectors to toggle selection
- Selected sectors highlighted (blue overlay)
- Watermarks visible with 50% opacity
- Validate button triggers verification

---

### Success / Blocked

**Files**: `Success.tsx`, `Blocked.tsx`

**Purpose**: Display verification results

Simple presentational components showing appropriate messages.

---

## Constants & Types

### Enums

**CaptchaStep**

```typescript
enum CaptchaStep {
  Camera = 'camera', // Camera feed with moving square
  Grid = 'grid', // Grid selection interface
  Result = 'result', // Verification result
}
```

**Shape**

```typescript
enum Shape {
  Triangle = 'triangle',
  Square = 'square',
  Circle = 'circle',
}
```

**Color**

```typescript
enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}
```

### Interfaces

**Sector**

```typescript
interface Sector {
  id: number; // Unique sector identifier (0-24)
  shape: Shape | null; // Watermark shape (null if empty)
  color: Color | null; // Watermark color (null if empty)
}
```

### Configuration Constants

```typescript
MAX_ATTEMPTS = 3; // Maximum validation attempts
GRID_SIZE = 5; // Grid dimensions (5x5 = 25 sectors)
SQUARE_SIZE_PERCENT = 0.8; // Square size (80% of smaller dimension)
MOVE_INTERVAL_MS = 1500; // Square movement interval (1.5 seconds)
```

### User Status

```typescript
USER_STATUS = {
  pending: 'pending', // Initial state
  failed: 'failed', // Validation failed (has retries)
  blocked: 'blocked', // Max attempts exceeded
  success: 'success', // Validation successful
};
```

---

## How It Works

### Complete User Flow

#### Phase 1: Camera Step

```
1. User lands on CAPTCHA
   ↓
2. Camera permission requested
   ↓
3. Camera feed displays
   ↓
4. Yellow square moves randomly every 1.5s
   ↓
5. User positions face in square
   ↓
6. User clicks "Continue"
   ↓
7. Current frame captured to canvas
   ↓
8. Grid challenge generated
```

#### Phase 2: Grid Step

```
1. Captured image displayed
   ↓
2. 5x5 grid overlay applied
   ↓
3. ~12-13 sectors have colored shape watermarks
   ↓
4. Random target selected (e.g., "Red Triangle")
   ↓
5. User selects matching sectors
   ↓
6. User clicks "Validate"
   ↓
7. Selection compared with correct answer
```

#### Phase 3: Result

```
SUCCESS:
  ✓ All correct sectors selected
  ✓ No incorrect sectors selected
  → Show success screen

FAILURE (attempts remaining):
  ✗ Incorrect selection
  → Show error + retry button
  → Decrement attempts
  → Reset to camera step

BLOCKED (no attempts left):
  ✗ 3 failed attempts
  → Show blocked screen
  → Prevent further attempts
```

### Technical Flow

#### 1. Component Initialization

```typescript
CaptchaContainer renders
  → StepProvider initializes (step: Camera, userStatus: pending)
  → SquareProvider initializes (squareSize: 200, squarePosition: {10, 10})
  → CaptchaProvider initializes (all null/empty)
  → CaptchaContent checks userStatus
  → Renders <Captcha />
```

#### 2. Camera Setup

```typescript
Captcha component mounts
  → useCameraFeed() requests camera
  → Stream attached to videoRef
  → useSquareRandomMove() starts interval
  → Square position updates every 1.5s
  → Updates SquareContext
  → CameraStream re-renders with new position
```

#### 3. Frame Capture

```typescript
User clicks "Continue"
  → handleCapture() called
  → useSquareRandomMove stops movement
  → Canvas dimensions set to container size
  → Video frame drawn to canvas
  → Canvas.toDataURL() converts to base64
  → Stored in CaptchaContext.capturedImage
  → generateGridChallenge() called
```

#### 4. Grid Generation

```typescript
generateGridChallenge()
  → Create array [0...24] (25 sectors)
  → Shuffle array
  → Select ~12 indices for watermarks
  → For each watermark:
    - Random shape (Triangle/Square/Circle)
    - Random color (Red/Green/Blue)
  → Store in CaptchaContext.gridSectors
  → Select random watermark as target
  → Store in CaptchaContext.target
  → updateStep(CaptchaStep.Grid)
```

#### 5. User Selection

```typescript
User clicks sector
  → toggleSectorSelection(sectorId)
  → CaptchaContext.selectedSectors updated
  → Sector CSS class changes (bg-blue-500/50)
  → Visual feedback provided
```

#### 6. Validation

```typescript
User clicks "Validate"
  → handleValidate() called
  → Find all sectors matching target
  → Compare with selectedSectors Set
  → Check size AND exact members
  → Call onValidate(isSuccess)
    ↓
    IF SUCCESS:
      → setUserStatus('success')
      → Show Success component
    ELSE IF attempts > 0:
      → Decrement attemptsLeft
      → Show retry UI
      → Can reset to camera
    ELSE:
      → setUserStatus('blocked')
      → Show Blocked component
```

---

## Package Dependencies

### Production Dependencies

#### 1. **next (16.0.3)**

**Purpose**: React framework with SSR, routing, and optimization

**Why we use it:**

- Built-in routing (app directory)
- Server-side rendering capabilities
- Automatic code splitting
- Image and font optimization
- TypeScript support out-of-the-box

**Where it's used:**

- Entire application framework
- `app/` directory structure
- Page routing

---

#### 2. **react (19.2.0) & react-dom (19.2.0)**

**Purpose**: Core React library

**Why we use it:**

- Component-based architecture
- Hooks for state management
- Virtual DOM for performance
- Context API for global state

**Where it's used:**

- All components (`.tsx` files)
- Custom hooks
- Context providers

---

#### 3. **lucide-react (^0.553.0)**

**Purpose**: Icon library

**Why we use it:**

- Lightweight SVG icons
- Tree-shakeable (only imports used icons)
- TypeScript support
- Consistent design

**Where it's used:**

```typescript
// src/modules/shared/constants/index.tsx
import { CircleIcon, SquareIcon, TriangleIcon } from 'lucide-react';

const SHAPE_MAP = {
  [Shape.Triangle]: TriangleIcon,
  [Shape.Square]: SquareIcon,
  [Shape.Circle]: CircleIcon,
};
```

**Alternatives considered:**

- FontAwesome (heavier, more icons than needed)
- Material Icons (different design aesthetic)
- Custom SVGs (more maintenance)

---

#### 4. **prettier-plugin-organize-imports (^4.3.0)**

**Purpose**: Automatically organize import statements

**Why we use it:**

- Consistent import ordering
- Removes unused imports
- Improves code readability
- Integrates with Prettier

---

### Development Dependencies

#### 1. **typescript (^5)**

**Purpose**: Static type checking

**Why we use it:**

- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Refactoring safety

**Configuration**: `tsconfig.json`

```json
{
  "strict": true,
  "jsx": "preserve",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

---

#### 2. **@tailwindcss/postcss (^4)**

**Purpose**: Utility-first CSS framework

**Why we use it:**

- Rapid UI development
- Consistent design system
- Responsive utilities
- Small production bundle (unused classes removed)

**Where it's used:**

```tsx
<div className="flex flex-col items-center justify-center p-4">
  <button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3">
    Continue
  </button>
</div>
```

**Benefits:**

- No separate CSS files needed
- Classes describe exactly what they do
- Easy to maintain consistency
- Dark mode support built-in

---

#### 3. **eslint (^9) & eslint-config-next (16.0.3)**

**Purpose**: Code linting and style enforcement

**Why we use it:**

- Catch common mistakes
- Enforce code style
- Next.js best practices
- Hook rules enforcement

---

#### 4. **@types packages**

**Purpose**: TypeScript type definitions

**Packages:**

- `@types/node`: Node.js types
- `@types/react`: React types
- `@types/react-dom`: ReactDOM types

**Why we use them:**

- Enable TypeScript for JavaScript libraries
- Provide autocomplete in IDE
- Required for type safety

---

## Key Design Decisions

### 1. Why Context API instead of Redux?

**Decision**: Use Context API

**Reasons:**

- Application state is simple (no complex async flows)
- Three distinct state domains (easy to separate)
- No need for middleware
- Lighter bundle size
- Native React solution
- Easier to understand for team members

**Trade-offs:**

- Redux has better DevTools
- Redux has more established patterns
- Context causes re-renders of entire subtree

**Mitigation**: Split contexts to minimize re-render scope

---

### 2. Why Custom Hooks?

**Decision**: Extract logic into custom hooks

**Reasons:**

- Reusability across components
- Easier to test in isolation
- Cleaner component code (focus on UI)
- Better separation of concerns
- Can compose hooks together

---

### 3. Why Refs in Context?

**Decision**: Store videoRef and canvasRef in StepContext

**Reasons:**

- Prevents ref duplication (memory leaks)
- Refs don't cause re-renders
- Multiple components need access
- Ensures single source of truth

**Alternative considered**: Pass refs as props (rejected due to prop drilling)

---

### 4. Why Three Separate Contexts?

**Decision**: Split into StepContext, SquareContext, CaptchaContext

**Reasons:**

- Performance: Components only re-render when their context changes
- Clarity: Each context has clear responsibility
- Maintainability: Easy to understand what state belongs where
- Reusability: Can use contexts independently

**Example**: Square movement updates SquareContext but doesn't affect components using only CaptchaContext

---

### 5. Why Canvas for Capture?

**Decision**: Use HTML Canvas to capture video frame

**Reasons:**

- Native browser API (no external dependency)
- Can manipulate image if needed
- Convert to base64 for easy storage
- Works with all modern browsers

**Alternative considered**:

- `getUserMedia` with MediaRecorder (more complex)
- External library (unnecessary dependency)

---

### 6. Why Set for selectedSectors?

**Decision**: Use `Set<number>` instead of `number[]`

**Reasons:**

- O(1) lookup time for validation
- No duplicates automatically
- Easy add/remove operations
- `.has()` more readable than `.includes()`

```typescript
// Efficient validation
const isCorrect =
  selectedSectors.size === correctSectors.size &&
  [...selectedSectors].every(id => correctSectors.has(id));
```

---

## Performance Considerations

### 1. Memoization

Components use `useCallback` for functions passed as props:

```typescript
const handleValidate = useCallback(
  (success: boolean) => {
    /* ... */
  },
  [attemptsLeft, setUserStatus]
);
```

### 2. Ref Usage

DOM refs used instead of state where re-renders aren't needed:

```typescript
const containerRef = useRef<HTMLDivElement>(null);
// Reading containerRef.current doesn't cause re-render
```

### 3. Context Splitting

Three contexts prevent unnecessary re-renders:

- Square animation updates don't affect CAPTCHA data consumers
- Step changes don't re-render components using only square position

### 4. Lazy Evaluation

Grid only generated after capture (not on initial render):

```typescript
const handleCapture = () => {
  // Capture frame
  generateGridChallenge(); // Only now
};
```

---

## Security Considerations

### 1. Client-Side Validation

**Current**: All validation happens client-side

**Production Recommendation**:

- Send challenge result to backend
- Validate server-side
- Generate tokens/JWT
- Rate limit requests

### 2. Challenge Randomization

- Random square positions
- Random watermark placement
- Random target selection
- Makes automated solving difficult

### 3. Time-Based Challenges

- Could add: Minimum time in camera step
- Could add: Maximum time in grid step
- Prevents instant bot submission

### 4. Image Analysis

- Captured image proves human presence
- Could add: Server-side face detection
- Could add: Liveness detection

---

## Testing Recommendations

### Unit Tests

```typescript
// Test custom hooks
describe('useCaptchaSelector', () => {
  it('should toggle sector selection', () => {
    // ...
  });
});

// Test context providers
describe('CaptchaContext', () => {
  it('should reset state', () => {
    // ...
  });
});
```

### Integration Tests

```typescript
// Test component interactions
describe('Captcha Flow', () => {
  it('should navigate from camera to grid', () => {
    // ...
  });

  it('should validate correct selection', () => {
    // ...
  });
});
```

### E2E Tests

```typescript
// Test full user flow
describe('Complete CAPTCHA', () => {
  it('should allow user to complete captcha', () => {
    // 1. Grant camera permission
    // 2. Click continue
    // 3. Select correct sectors
    // 4. Validate
    // 5. Assert success screen
  });
});
```

---

## Future Enhancements

### 1. Backend Integration

- Server-side validation
- Session management
- Challenge tokens
- API rate limiting

### 2. Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- Audio CAPTCHA alternative

### 3. Advanced Security

- Face detection verification
- Liveness detection (blink, smile)
- ML-based bot detection
- Browser fingerprinting

### 4. Analytics

- Track completion rates
- Monitor failure patterns
- A/B test difficulty
- User behavior analysis

### 5. Localization

- Multi-language support
- RTL layout support
- Cultural shape variations

### 6. Mobile Optimization

- Touch gesture optimization
- Mobile camera handling
- Responsive grid sizing
- Portrait/landscape support

---

## Troubleshooting

### Camera Not Working

**Symptoms**: Black screen, permission denied

**Solutions:**

1. Check browser permissions
2. Ensure HTTPS (camera requires secure context)
3. Check for other apps using camera
4. Try different browser

### Square Not Moving

**Symptoms**: Square stays in one position

**Debug:**

1. Check `isSquareMoving` state
2. Verify step is `CaptchaStep.Camera`
3. Check interval cleanup
4. Inspect console for errors

### Grid Not Displaying

**Symptoms**: Captured image missing, empty grid

**Debug:**

1. Verify canvas ref exists
2. Check captured image in context
3. Verify grid generation logic
4. Inspect gridSectors array

### Validation Always Failing

**Symptoms**: Correct selection marked wrong

**Debug:**

1. Console.log correctSectors vs selectedSectors
2. Verify Set equality logic
3. Check target is set correctly
4. Ensure sector IDs match

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Browser Compatibility

**Minimum Requirements:**

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**APIs Used:**

- `getUserMedia()` - Camera access
- HTML5 Canvas
- ES6+ (Classes, Arrow functions, Async/await)
- React 19 features

---

## Contributing Guidelines

### Code Style

- Use TypeScript for all new files
- Follow existing component structure
- Use functional components with hooks
- Keep components focused (single responsibility)

### Context Updates

- Don't add to existing contexts unnecessarily
- Consider creating new context if state is unrelated
- Always provide proper TypeScript types

### Hook Creation

- Extract reusable logic into custom hooks
- Name hooks with `use` prefix
- Document parameters and return values
- Handle cleanup properly (useEffect returns)

---

## Conclusion

This interactive CAPTCHA system demonstrates modern React architecture with:

✅ **Clean Architecture**: Separated contexts, hooks, and components  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Performance**: Optimized re-renders with context splitting  
✅ **Maintainability**: Clear structure and responsibilities  
✅ **Scalability**: Easy to extend with new features  
✅ **Best Practices**: Follows React and Next.js conventions

The design patterns implemented ensure the codebase remains maintainable as it grows while providing a solid foundation for future enhancements.

---

**Last Updated**: November 17, 2025  
**Version**: 0.1.0  
**Author**: MeldCX Team
