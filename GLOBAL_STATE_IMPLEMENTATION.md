# Global State Implementation for Captcha

## Overview

Implemented a global state management solution using React Context to share `target`, `selectedSectors`, `capturedImage`, and `gridSectors` across multiple hooks (`useVideoCapture` and `useCaptchaSelector`) without causing re-renders or memory leaks.

## Changes Made

### 1. Created Context Provider

**File**: `/src/modules/shared/context/CaptchaContext.tsx`

- Created `CaptchaProvider` component to manage global state
- Provides state and setters for:
  - `target` - The shape and color challenge
  - `selectedSectors` - User's sector selections
  - `capturedImage` - The captured camera frame
  - `gridSectors` - Grid sectors with watermarks
- Includes helper functions:
  - `toggleSectorSelection()` - Toggle sector selection
  - `resetCaptchaState()` - Reset all state for new attempts

### 2. Updated Hooks

#### `useVideoCapture.ts`

- Removed local state for `target`, `selectedSectors`, `capturedImage`, `gridSectors`
- Now uses `useCaptchaContext()` to access and update global state
- Returns `handleValidate` function for grid validation
- No longer returns state values (they're in context now)

#### `useCaptchaSelector.ts`

- Implemented hook to access global captcha state
- Returns:
  - `target`, `selectedSectors`, `capturedImage`, `gridSectors`
  - `toggleSectorSelection` helper function

#### `useStepAndAttempt.ts`

- Integrated with context to reset global state
- `handleTryAgain()` now calls `resetCaptchaState()` to clear all captcha state

### 3. Updated Components

#### `CaptchaContainer.tsx`

- Wrapped content with `<CaptchaProvider>` to provide context to all children

#### `Captcha.tsx`

- Integrated `useVideoCapture` hook
- Passes validation handler to `ImageGridCaptchaSelector`

#### `ImageGridSelector.tsx`

- Updated to receive props: `containerRef`, `squarePosition`, `squareSize`, `handleValidate`
- Uses `useCaptchaSelector()` to access global state
- Calls `toggleSectorSelection()` when sectors are clicked

## Benefits

✅ **No Re-renders**: Context only triggers re-renders for components that consume it
✅ **No Memory Leaks**: Single source of truth, no duplicate state
✅ **Clean Separation**: Hooks access shared state without tight coupling
✅ **Easy Reset**: Global state can be reset in one place
✅ **Type-Safe**: Full TypeScript support with proper interfaces

## Usage Example

```tsx
// In useVideoCapture
const { setTarget, setCapturedImage, setGridSectors } = useCaptchaContext();

// In useCaptchaSelector
const { target, selectedSectors, capturedImage, gridSectors } =
  useCaptchaSelector();

// In any component
const { resetCaptchaState } = useCaptchaContext();
resetCaptchaState(); // Clear all captcha state
```

## Architecture

```
CaptchaProvider (Context)
├── Captcha Component
│   ├── useVideoCapture (writes to context)
│   └── ImageGridSelector
│       └── useCaptchaSelector (reads from context)
```

State flows from `useVideoCapture` → Context → `useCaptchaSelector` without prop drilling or duplication.
