# @zbav-se.me/ui

> Common UI components library for the zbav-se.me project

## Overview

This package contains general-purpose, reusable UI components that are **not tied to any specific business logic domain**. These components serve as the foundational building blocks for the zbav-se.me application ecosystem, providing consistent styling, behavior, and user experience across all apps.

## Purpose

The main goals of this package are to:

- **Provide domain-agnostic components** that can be used across multiple applications
- **Ensure consistency** in UI/UX throughout the project
- **Reduce code duplication** by centralizing common UI patterns
- **Maintain separation of concerns** by keeping generic UI separate from business logic
- **Enable rapid development** through a shared component library

## Component Categories

### 🎨 Styling & Theming (`cls/`)
Centralized styling utilities and theme classes:
- `ThemeCls` - Core theme styling classes
- `ToneRoseCls` - Rose tone color schemes
- `ToneStrongCls` - Strong/bold tone color schemes

### 📦 Containers (`container/`)
Layout and structural components:
- `BottomContainer` - Fixed bottom positioning container
- `FlowContainer` - Flow-based layout container
- `ModalContainer` - Modal dialog container
- `TitleContainer` - Titled section container

### ✨ Animations (`fade/`)
Animation components:
- `Fade` - Fade in/out animation component

### 📝 Forms (`form/`)
Form utilities and hooks:
- `useAppForm` - Custom form hook with validation and state management

### 🎯 Icons (`icon/`)
Comprehensive icon set for the application:
- Navigation icons (Dashboard, Feed, Favourite, etc.)
- Action icons (Check, Cancel, Clear, Submit, etc.)
- Domain icons (Age, Condition, Category, Location, Price, etc.)
- User role icons (Buyer, Seller, etc.)
- Status icons (Lock, Unlock, Flag, Star, etc.)
- Letter icons (A-F)
- Social & communication icons

### 🖼️ Images (`img/`)
Image components and utilities:
- `HeroImage` - Hero/banner image component with a stable wrapper and in-place loading/error overlays
- `HeroImageCls` - Hero image styling

### 🏷️ Branding (`logo/`)
Brand identity components:
- `Logo` - Application logo component

### ⭐ Rating (`rating/`)
Rating display and interaction:
- `Rating` - Rating picker with icon + label/hint render functions (`textRatingFn`, `textHintFn`)
  - Prefix/suffix render callbacks were removed from the public API.
- `RatingCls` - Rating styling classes
- `RatingToIcon` - Rating value to icon mapper

### 📄 Sheet (`sheet/`)
Sheet/drawer components:
- `Sheet` - Bottom sheet/drawer component

### 🔢 Dial (`dial/`)
Numeric dial input components:
- `Dial` - Numeric keypad with editable value/placeholder display

### 📰 Typography (`title/`, `typo/`)
Text and typography components:
- `Title` - Section title component
- `TypoIcon` - Typography with icon component
- `TypoIconCls` - Typography-icon styling

## Technology Stack

- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **@tanstack/react-form** - Form management
- **@use-pico** - Internal framework utilities
- **ts-pattern** - Pattern matching for TypeScript

## Usage

Components are organized by feature and exported through barrel files. Import components using the package namespace:

```typescript
// Import individual components
import { Logo } from "@zbav-se.me/ui/logo";
import { Rating } from "@zbav-se.me/ui/rating";
import { ModalContainer } from "@zbav-se.me/ui/container";
import { CheckIcon, CancelIcon } from "@zbav-se.me/ui/icon";

// Use in your components
export const MyComponent = () => {
  return (
    <ModalContainer>
      <Logo />
      <Rating value={4} />
    </ModalContainer>
  );
};
```

## Guidelines

When adding components to this package:

1. ✅ **DO** add components that are:
   - Generic and reusable across multiple domains
   - Not tied to specific business logic
   - Presentation-focused
   - Shared across multiple apps

2. ❌ **DON'T** add components that:
   - Contain business logic specific to a domain
   - Make API calls or handle data fetching
   - Are only used in one specific app or feature
   - Mix UI concerns with business logic

## Development

```bash
# Type checking
bun run typecheck

# Dependency audit (local binary)
bun run knip
```

## Dependency Hygiene

Knip is configured per workspace and executed from local `devDependencies` to avoid `bun x` drift.
Monorepo-internal `@use-pico/*` imports are filtered in this package to reduce known false positives.
Unused direct dependencies (`react-dom`, `ts-pattern`) and unused type package (`@types/react-dom`) were removed after source verification.

## Architecture

This package follows a **feature-based structure** where each component category lives in its own directory with:
- Component files (`.tsx`)
- Supporting utilities (`.ts`)
- Barrel export (`index.ts`)

The package uses TypeScript path mapping for clean imports and is consumed as a workspace dependency within the monorepo.

## Related Packages

- `@use-pico/client` - Client-side framework utilities
- `@use-pico/common` - Common utilities and types
- `@zbav-se.me/buyer` - Buyer-specific business logic
- `@zbav-se.me/seller` - Seller-specific business logic
- `@zbav-se.me/common` - Shared domain utilities

---

**Note**: This package is part of the zbav-se.me monorepo and is designed to work within the workspace ecosystem.
