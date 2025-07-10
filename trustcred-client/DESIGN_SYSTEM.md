# TrustCred Design System

A comprehensive theme and design system for the TrustCred digital credentials platform, built with security, trust, and professionalism in mind.

## Overview

The TrustCred design system provides a cohesive visual identity that conveys security, trust, and reliability - essential qualities for a digital credentials platform. The theme includes carefully chosen colors, gradients, typography, and components that work together to create a professional and modern user experience.

## Color Palette

### Primary Colors

#### Trust Blue
Our primary brand color that conveys security, trust, and reliability.
- **50**: `#eff6ff` - Very light blue for subtle backgrounds
- **100**: `#dbeafe` - Light blue for highlights and accents
- **200**: `#bfdbfe` - Soft blue for secondary elements
- **300**: `#93c5fd` - Medium-light blue
- **400**: `#60a5fa` - Medium blue
- **500**: `#3b82f6` - Primary blue
- **600**: `#2563eb` - Primary dark blue (main brand color)
- **700**: `#1d4ed8` - Dark blue for emphasis
- **800**: `#1e40af` - Very dark blue
- **900**: `#1e3a8a` - Darkest blue
- **950**: `#172554` - Ultra dark blue

#### Security Green
Used for verified credentials, success states, and positive actions.
- **50**: `#f0fdf4` - Very light green
- **100**: `#dcfce7` - Light green backgrounds
- **200**: `#bbf7d0` - Soft green accents
- **300**: `#86efac` - Medium-light green
- **400**: `#4ade80` - Medium green
- **500**: `#22c55e` - Primary green
- **600**: `#16a34a` - Primary dark green
- **700**: `#15803d` - Dark green
- **800**: `#166534` - Very dark green
- **900**: `#14532d` - Darkest green

#### Professional Gray
Neutral colors for text, backgrounds, and structural elements.
- **50**: `#f8fafc` - Off-white background
- **100**: `#f1f5f9` - Very light gray
- **200**: `#e2e8f0` - Light gray borders
- **300**: `#cbd5e1` - Medium-light gray
- **400**: `#94a3b8` - Medium gray text
- **500**: `#64748b` - Standard gray text
- **600**: `#475569` - Dark gray text
- **700**: `#334155` - Very dark gray
- **800**: `#1e293b` - Almost black
- **900**: `#0f172a` - Pure dark background

### Status Colors

#### Warning Amber
For pending verification, attention states, and warnings.
- **50**: `#fffbeb` - Very light amber
- **100**: `#fef3c7` - Light amber backgrounds
- **200**: `#fde68a` - Soft amber
- **300**: `#fcd34d` - Medium amber
- **400**: `#fbbf24` - Medium-dark amber
- **500**: `#f59e0b` - Primary amber
- **600**: `#d97706` - Dark amber

#### Danger Red
For revoked credentials, errors, and destructive actions.
- **50**: `#fef2f2` - Very light red
- **100**: `#fee2e2` - Light red backgrounds
- **200**: `#fecaca` - Soft red
- **300**: `#fca5a5` - Medium-light red
- **400**: `#f87171` - Medium red
- **500**: `#ef4444` - Primary red
- **600**: `#dc2626` - Primary dark red
- **700**: `#b91c1c` - Dark red

## Gradients

The theme includes several predefined gradients for different use cases:

- **Primary**: Blue gradient for main actions and primary elements
- **Secondary**: Green gradient for success states and verified elements
- **Hero**: Multi-color gradient combining blue and green for hero sections
- **Card**: Subtle gradient for card backgrounds
- **Hover**: Interactive gradient for hover states

## Component Classes

### Buttons

```css
.btn-primary     /* Primary blue button */
.btn-secondary   /* Subtle secondary button */
.btn-accent      /* Green accent button */
.btn-gradient    /* Gradient primary button */
```

### Cards

```css
.card            /* Standard card with border */
.card-gradient   /* Card with gradient background */
```

### Status Indicators

```css
.status-verified /* Green verified status */
.status-pending  /* Amber pending status */
.status-revoked  /* Red revoked status */
```

### Utility Classes

```css
.gradient-primary    /* Apply primary gradient */
.gradient-secondary  /* Apply secondary gradient */
.gradient-hero       /* Apply hero gradient */
.gradient-card       /* Apply card gradient */
.shadow-trust        /* Apply trust-themed shadow */
.animate-gradient    /* Animated gradient effect */
.glass               /* Glass morphism effect */
.focus-ring          /* Consistent focus styles */
```

## Usage Examples

### Using the Theme in Components

```tsx
import { trustCredTheme, getStatusColor, getGradient } from '../lib/theme';

// Get status colors
const verifiedColor = getStatusColor('verified');
const pendingColor = getStatusColor('pending', isDarkMode);

// Get gradients
const primaryGradient = getGradient('primary');
const heroGradient = getGradient('hero');

// Use theme colors
const primaryColor = trustCredTheme.colors.trustBlue[600];
const securityColor = trustCredTheme.colors.securityGreen[500];
```

### CSS Custom Properties

All colors are available as CSS custom properties:

```css
/* Primary colors */
color: var(--trust-blue-600);
background-color: var(--security-green-500);

/* Semantic colors */
color: var(--foreground);
background-color: var(--background);
border-color: var(--border);

/* Gradients */
background: var(--gradient-primary);
background: var(--gradient-hero);
```

### Tailwind CSS Classes

Use the extended Tailwind classes for direct styling:

```html
<!-- Trust Blue -->
<div class="bg-trust-blue-600 text-white">Primary Button</div>

<!-- Security Green -->
<div class="bg-security-green-500 text-white">Verified Badge</div>

<!-- Professional Gray -->
<div class="bg-professional-gray-100 text-professional-gray-800">Card</div>

<!-- Status Colors -->
<span class="text-warning-amber-600">Pending</span>
<span class="text-danger-red-600">Error</span>
```

## Dark Mode Support

The theme automatically adapts to dark mode using CSS media queries. All colors, gradients, and shadows have dark mode variants that maintain contrast and readability.

### Dark Mode Behavior

- Background colors shift to darker variants
- Text colors invert for proper contrast
- Gradients adjust to work well on dark backgrounds
- Shadows become more pronounced with blue tints
- Status indicators maintain their semantic meaning while adapting contrast

## Accessibility

The theme is designed with accessibility in mind:

- **High Contrast**: All color combinations meet WCAG 2.1 AA standards
- **Focus States**: Clear focus indicators for keyboard navigation
- **Color Independence**: Information is not conveyed by color alone
- **Readable Text**: Sufficient contrast ratios for all text elements

## Best Practices

### When to Use Each Color

- **Trust Blue**: Primary actions, links, main branding elements
- **Security Green**: Success states, verified credentials, positive feedback
- **Professional Gray**: Text, backgrounds, neutral elements
- **Warning Amber**: Attention states, pending verification, caution
- **Danger Red**: Errors, revoked credentials, destructive actions

### Component Guidelines

1. Use `btn-gradient` for primary call-to-action buttons
2. Use `card` class for content containers
3. Apply `status-*` classes for credential status indicators
4. Use `shadow-trust` for elevated elements that need emphasis
5. Apply `focus-ring` to interactive elements for accessibility

### Typography

- Use the system font stack for optimal performance
- Maintain consistent hierarchy with the predefined font sizes
- Apply appropriate line heights for readability
- Use font weights purposefully (medium for emphasis, semibold for headings)

## Integration

The theme is designed to work seamlessly with:
- **Tailwind CSS 4.x**
- **Next.js 15**
- **React 19**
- **Modern CSS features** (custom properties, color-mix, etc.)

## Customization

To customize the theme:

1. Modify the CSS custom properties in `globals.css`
2. Update the theme object in `lib/theme.ts`
3. Extend the Tailwind configuration in `tailwind.config.js`
4. Test changes in both light and dark modes
5. Ensure accessibility standards are maintained

## File Structure

```
trustcred-client/
├── app/
│   ├── globals.css          # Theme CSS variables and utility classes
│   └── page.tsx            # Demo page showcasing the theme
├── lib/
│   └── theme.ts           # TypeScript theme configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

This design system provides a solid foundation for building the TrustCred platform while maintaining consistency, accessibility, and professional appearance across all components and pages.
