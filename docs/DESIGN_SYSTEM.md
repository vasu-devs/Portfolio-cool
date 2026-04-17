# Portfolio Design System & Style Guide

This document provides a comprehensive technical and aesthetic breakdown of the UI design system. It is designed to be modular, enabling anyone to re-engineer or replicate the website's look and feel from the framework level up to the finishing touches.

## 1. Core Architecture & Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) | Fast development and component-based UI. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety for props and state. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling with custom design tokens. |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Orchestrating complex UI transitions and micro-interactions. |
| **Smooth Scroll** | [Lenis](https://github.com/darkroomengineering/lenis) | High-performance smooth scrolling. |

---

## 2. Color Palette (Design Tokens)

The system utilizes CSS variables for theme switching (Light/Dark). The aesthetic is centered around deep blacks and pure whites with neutral zinc accents.

### Light Mode (`:root`)
- **Primary Background**: `#ffffff` (Pure White)
- **Secondary Background**: `#f4f4f5` (Zinc-100)
- **Primary Foreground**: `#050505` (Deep Black)
- **Secondary Foreground**: `#52525b` (Zinc-600)
- **Border**: `#e4e4e7` (Zinc-200)
- **Accent Glow**: `rgba(0, 0, 0, 0.08)`

### Dark Mode (`[data-theme='dark']`)
- **Primary Background**: `#050505` (Deep Black)
- **Secondary Background**: `#0A0A0A` (Zinc-950)
- **Primary Foreground**: `#ffffff` (Pure White)
- **Secondary Foreground**: `#a1a1aa` (Zinc-400)
- **Border**: `#27272a` (Zinc-800)
- **Accent Glow**: `rgba(255, 255, 255, 0.15)`

---

## 3. Typography

Fonts are served via Google Fonts and structured to provide a distinct hierarchy between high-impact headings and utility text.

| Font Style | Family | Usage |
| :--- | :--- | :--- |
| **Display** | `Outfit`, sans-serif | Hero titles, large headings (weights: 400-900). |
| **Body** | `Inter`, sans-serif | General content, descriptions (weights: 300-600). |
| **Mono** | `JetBrains Mono`, monospace | Navigation, badges, labels, technical metadata. |

### Text Effects
- **Text Outline**: Used for large background text in dark mode (`text-shadow` hack to create thin borders).
- **Lowercase/Uppercase**: Heavy use of `uppercase` for monospace labels and `lowercase` for sub-branding.

---

## 4. Structural Layer & Layout

### Container System
- **Maximum Width**: Constrained for readability while allowing large display elements to bleed near edges.
- **Section Spacing**: Large vertical paddings (`py-24` or `pb-[20vw]`) to create "breathing room" and a premium editorial feel.

### Stacked Sections
- **Hero Stacking**: The Hero section is `fixed` at the bottom layer. Subsequent sections have a higher `z-index` and slide *over* the Hero during scroll, creating a physical "sheet" movement effect.

---

## 5. UI Components (Modular Design)

### The Magnetic Button
A sophisticated interaction pattern where buttons "stick" to the cursor when nearby.
- **Logic**: Calculates distance from cursor to button center; applies a translation factor (0.15 strength).
- **Physics**: Uses Framer Motion `spring` with `stiffness: 200` and `damping: 20`.

### Status Badge
A "Global Status" indicator (e.g., "Available for work").
- **Styling**: `inline-flex`, `backdrop-blur-xl`, `border`, `rounded-full`.
- **Location**: Fixed top-right or absolute within nav.

### Glassmorphism Card
Used for project modals and navigation menus.
- **Light**: `rgba(255, 255, 255, 0.7)` with `12px` blur.
- **Dark**: `rgba(10, 10, 10, 0.7)` with `12px` blur.
- **Border**: `1px solid var(--border-primary)`.

---

## 6. Motion & Interactive Details

### Interactive Theme Transition
Changing themes triggers a custom "expanding circle" transition.
- **Mechanism**: Captures the click coordinates and animates a radial gradient circle scaling from `0` to `5` to cover the viewport.
- **Visuals**: Includes "spark" lines radiating from the click point.

### Custom Cursor
A theme-aware cursor that reacts to interactive elements.
- **States**: Default (dot), Hover (expanding circle), App Transitioning (loading state).

### Lenis Smooth Scroll
- **Configuration**: Standard smooth scrolling to eliminate browser "jank".
- **Integration**: Essential for the parallax and stacking section effects to feel fluid.

---

## 7. Finishing Touches (The "Signature" Layer)

### Film Grain Overlay
A fixed, low-opacity grain effect that gives the digital interface a subtle analog texture.
- **Implementation**: SVG Turbulence filter as a background image.
- **Settings**: `opacity: 0.03`, `pointer-events: none`, `zIndex: 9999`.

### Mix Blend Modes
- **Difference Blend**: Large Hero text uses `mix-blend-difference` on large screens to invert based on the background/image layer, ensuring legibility and a high-fashion aesthetic.

### Image Post-Processing
Images are processed in real-time via CSS filters:
- **Dark Mode**: `grayscale(10%) contrast(125%) brightness(1.1)`.
- **Light Mode**: `grayscale(15%) contrast(110%) brightness(0.95)`.
