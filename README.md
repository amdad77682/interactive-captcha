# Interactive CAPTCHA

A camera-based CAPTCHA system using visual pattern recognition. Users capture a selfie with a moving square overlay, then identify shapes and colors in a grid challenge.

## Overview

Two-step verification process:
1. **Camera**: Capture your face within a randomly moving square
2. **Grid**: Select all sectors matching the target shape and color

Failed attempts are tracked, with blocking after 3 tries.

## Tech Stack

- Next.js 16 & React 19
- TypeScript
- Tailwind CSS 4
- Lucide React (icons)

## Quick Start

```bash
git clone https://github.com/amdad77682/interactive-captcha.git
cd interactive-captcha-meldcx
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and grant camera access.

> **Note**: Camera requires HTTPS in production. Use ngrok for local testing if needed.


## Architecture & Design Patterns

```
src/
├── views/captcha/           # React components
│   ├── CameraStream.tsx     # Live camera feed
│   ├── ImageGridSelector.tsx # Grid challenge
│   ├── CaptchaSteps.tsx     # Flow controller
│   └── Success/Blocked.tsx  # Result screens
├── viewmodels/              # Custom hooks
│   ├── useCameraFeed.ts
│   ├── useVideoCapture.ts
│   ├── useSquareRandomMove.ts
│   └── useStepAndAttempt.ts
└── models/
    ├── context/             # React contexts (state)
    ├── interface/           # TypeScript types
    └── constants/           # Configuration
```


### Primary Architecture: MVVM (Model-View-ViewModel)

This project implements the **MVVM pattern** adapted for React's component-based architecture. Here's how each layer maps to the codebase:

```
┌─────────────────────────────────────────────────┐
│                    VIEW                          │
│  (React Components - Presentation Layer)        │
│  • CameraStream.tsx                             │
│  • ImageGridSelector.tsx                        │
│  • CaptchaSteps.tsx (Step Orchestrator)        │
│  • CaptchaUserSteps.tsx (Root with Providers)  │
│  • Success.tsx, Blocked.tsx                     │
└──────────────┬──────────────────────────────────┘
               │ Data Binding (Props & Context)
               ↓
┌─────────────────────────────────────────────────┐
│                 VIEWMODEL                        │
│  (Custom Hooks - Business Logic Layer)          │
│  • useVideoCapture (capture & validation logic) │
│  • useCameraFeed (camera management)            │
│  • useSquareRandomMove (animation logic)        │
│  • useStepAndAttempt (flow control)             │
└──────────────┬──────────────────────────────────┘
               │ State Management
               ↓
┌─────────────────────────────────────────────────┐
│                   MODEL                          │
│  (Data Layer - State & Business Entities)       │
│  • Context APIs (Global State):                 │
│    - StepContext (step, userStatus, refs)       │
│    - SquareContext (animation state)            │
│    - CaptchaContext (challenge data)            │
│  • Interfaces (TypeScript Types):               │
│    - Sector, Shape, Color, CaptchaStep         │
│  • Constants (Configuration)                    │
└─────────────────────────────────────────────────┘
```

#### 🎨 VIEW Layer (Presentation)
**Location**: `src/views/captcha/*.tsx`

**Responsibility**: Pure presentation and user interaction

**Components:**
- `CameraStream.tsx` - Displays camera feed with moving square overlay
- `ImageGridSelector.tsx` - Renders captured image with selectable grid
- `CaptchaSteps.tsx` - Step orchestrator that routes between camera and grid views
- `CaptchaUserSteps.tsx` - Root component with Context providers and user status routing
- `Success.tsx`, `Blocked.tsx` - Result screens

**Characteristics:**
- Zero business logic
- Receives data via props and context
- Emits user events to ViewModel (via callbacks)
- Focuses solely on UI rendering

---

#### 🧠 VIEWMODEL Layer (Business Logic)
**Location**: `src/viewmodels/*.ts`

**Responsibility**: Business logic, data transformation, and state management

**Custom Hooks (ViewModels):**
- `useVideoCapture` - Handles frame capture, grid generation, validation logic
- `useCameraFeed` - Manages camera initialization, permissions, cleanup
- `useSquareRandomMove` - Controls square animation algorithm
- `useStepAndAttempt` - Manages CAPTCHA flow and retry logic

**Characteristics:**
- Contains all business logic
- Interacts with Model (Context APIs)
- Provides data and functions to View
- No direct DOM manipulation
- Testable in isolation


---

#### 📦 MODEL Layer (Data)
**Location**: `src/models/` (context, interface, constants)

**Responsibility**: Data structures, state storage, and data access

**Components:**

1. **Context APIs (State Management)** - `src/models/context/`:
   - `StepContext.tsx` - Step flow, user status, DOM refs
   - `SquareContext.tsx` - Square animation state
   - `CaptchaContext.tsx` - Challenge data (target, sectors, selections)

2. **TypeScript Interfaces (Data Structures)** - `src/models/interface/`:
   ```typescript
   // interface/index.ts
   interface Sector {
     id: number;
     shape: Shape | null;
     color: Color | null;
   }
   
   enum CaptchaStep {
     Camera = 'camera',
     Grid = 'grid',
     Result = 'result'
   }
   ```

3. **Constants (Configuration)** - `src/models/constants/`:
   ```typescript
   // constants/index.tsx
   const MAX_ATTEMPTS = 3;
   const GRID_SIZE = 5;
   const USER_STATUS = { pending, success, blocked, failed };
   ```

**Characteristics:**
- Pure data structures
- No business logic
- Provides getters/setters via Context
- Single source of truth


---

### MVVM Data Flow

```
User Interaction → VIEW → ViewModel → Model → ViewModel → VIEW → UI Update
```

**Concrete Example: User Clicks "Continue" Button**

1. **VIEW** (`CameraStream.tsx`):
   ```tsx
   <button onClick={handleCapture}>Continue</button>
   ```

2. **VIEWMODEL** (`useVideoCapture.ts`):
   ```typescript
   const handleCapture = () => {
     // Business logic: Capture frame
     ctx.drawImage(video, 0, 0);
     const imageData = canvas.toDataURL('image/jpeg');
     
     // Update MODEL
     setCapturedImage(imageData);      // → CaptchaContext
     generateGridChallenge();          // Generate data
     updateStep(CaptchaStep.Grid);     // → StepContext
   };
   ```

3. **MODEL** (`CaptchaContext` + `StepContext`):
   ```typescript
   // State updated
   capturedImage: "data:image/jpeg;base64,..."
   step: CaptchaStep.Grid
   gridSectors: [...25 sectors]
   target: { shape: 'triangle', color: 'red' }
   ```

4. **VIEWMODEL** (Context consumers automatically get updates)

5. **VIEW** (React re-renders with new data):
   ```tsx
   // CaptchaSteps.tsx switches view
   {step === CaptchaStep.Grid && <ImageGridSelector />}
   
   // ImageGridSelector.tsx displays new data
   <img src={capturedImage} />
   <div>{gridSectors.map(sector => ...)}</div>
   ```

---

### Benefits of MVVM in This Project

| Benefit | Implementation |
|---------|----------------|
| **Separation of Concerns** | View components have zero business logic |
| **Testability** | Hooks can be tested independently with mock contexts |
| **Reusability** | Same ViewModel (hook) can be used by multiple Views |
| **Maintainability** | Changes to business logic don't affect UI structure |
| **Type Safety** | TypeScript ensures Model consistency |
| **Two-Way Binding** | React Context provides automatic UI updates |
| **Scalability** | Easy to add new features by adding hooks/contexts |

---

### Why MVVM for This Project?

1. **Complex State Management**: Multiple interconnected states (camera, square, grid, user status)
2. **Asynchronous Operations**: Camera initialization, frame capture need business logic layer
3. **Validation Logic**: Grid validation is complex and needs isolation from UI
4. **Testability Requirements**: Business logic must be testable without rendering UI
5. **React Best Practices**: Custom hooks are React's natural ViewModel layer


---

### State Management

Three separate contexts prevent unnecessary re-renders:

- **StepContext**: Flow control and refs
- **SquareContext**: Animation state
- **CaptchaContext**: Challenge data

### Key Hooks

**useCameraFeed** - Manages camera stream lifecycle  
**useVideoCapture** - Captures frames and generates grid challenges  
**useSquareRandomMove** - Animates square overlay every 1.5s  
**useStepAndAttempt** - Handles retry logic and step transitions

## How It Works

### User Flow

1. Camera activates with square moving every 1.5s
2. Click "Continue" to capture frame
3. System generates 5x5 grid with random colored shapes (~50% of sectors)
4. Random shape-color combo chosen as target
5. Select all matching sectors
6. Click "Validate" to check answer

Success shows completion screen. Failures allow retry (3 attempts max).

### Technical Flow

```typescript
// Frame Capture
video → canvas.drawImage() → base64 string → CaptchaContext

// Grid Generation  
25 sectors → shuffle → assign random shapes+colors → pick target

// Validation
correctSectors ∩ selectedSectors === correctSectors ✓
```

## Configuration

```typescript
// src/models/constants/index.tsx
MAX_ATTEMPTS = 3           // Retry limit before blocking
GRID_SIZE = 5             // 5x5 grid = 25 sectors
SQUARE_SIZE_PERCENT = 0.8 // Square size (80% of container)
MOVE_INTERVAL_MS = 1500   // Movement speed
```

## Development

```bash
npm run dev    # Development server
npm run build  # Production build  
npm run lint   # Lint code
```

## Browser Support

Requires `getUserMedia()` API support:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT