/**
 * ZYPERIA DESIGN TOKENS
 * Centralized color, typography, and spacing system for all 3 blogs
 * Ensures consistency and scalability across crypto, intelligence, onlinebiz
 */

// ============================================================================
// COLOR PALETTE - CRYPTO (Amber + Blue dark theme)
// ============================================================================

export const CRYPTO_COLORS = {
  // Primary & Accent
  primary: '#F59E0B', // Amber-500 (Bitcoin/gold)
  primaryLight: '#FCD34D', // Amber-300
  primaryDark: '#D97706', // Amber-600
  accent: '#2563EB', // Blue-600 (Blockchain)
  accentLight: '#3B82F6', // Blue-500
  accentDark: '#1D4ED8', // Blue-700

  // Background & Text
  background: '#030712', // Slate-950 (deep, premium)
  surfaceLight: '#1F2937', // Gray-800
  surfaceDark: '#0F172A', // Slate-900
  text: '#F1F5F9', // Slate-100
  textSecondary: '#CBD5E1', // Slate-300
  textTertiary: '#94A3B8', // Slate-400

  // Semantic
  success: '#10B981', // Emerald-500 (gains)
  warning: '#F59E0B', // Amber-500 (caution)
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500

  // Gradients
  heroGradient: 'linear-gradient(135deg, #FCD34D, #3B82F6, #06B6D4)', // Amber → Blue → Cyan
  buttonGradient: 'linear-gradient(135deg, #F59E0B, #DC2626)', // Amber → Red hover effect
};

// ============================================================================
// COLOR PALETTE - INTELLIGENCE (Blue + Cyan light theme)
// ============================================================================

export const INTELLIGENCE_COLORS = {
  // Primary & Accent
  primary: '#2563EB', // Blue-600 (Logic, tools)
  primaryLight: '#3B82F6', // Blue-500
  primaryDark: '#1D4ED8', // Blue-700
  accent: '#06B6D4', // Cyan-500 (AI, modern)
  accentLight: '#22D3EE', // Cyan-400
  accentDark: '#0891B2', // Cyan-600

  // Background & Text
  background: '#FFFFFF', // White (clean)
  surfaceLight: '#F9FAFB', // Gray-50
  surfaceDark: '#F3F4F6', // Gray-100
  text: '#0F172A', // Slate-900 (dark)
  textSecondary: '#475569', // Slate-600
  textTertiary: '#64748B', // Slate-500

  // Semantic
  success: '#059669', // Emerald-600
  warning: '#D97706', // Amber-600
  error: '#DC2626', // Red-600
  info: '#2563EB', // Blue-600

  // Gradients
  heroGradient: 'linear-gradient(135deg, #2563EB, #06B6D4, #A855F7)', // Blue → Cyan → Purple
  buttonGradient: 'linear-gradient(135deg, #2563EB, #0891B2)', // Blue → Cyan
};

// ============================================================================
// COLOR PALETTE - ONLINEBIZ (Emerald + Amber light theme)
// ============================================================================

export const ONLINEBIZ_COLORS = {
  // Primary & Accent
  primary: '#059669', // Emerald-600 (Growth, wealth)
  primaryLight: '#10B981', // Emerald-500
  primaryDark: '#047857', // Emerald-700
  accent: '#F59E0B', // Amber-500 (Money, warmth)
  accentLight: '#FCD34D', // Amber-300
  accentDark: '#D97706', // Amber-600

  // Background & Text
  background: '#FFFFFF', // White (clean, trustworthy)
  surfaceLight: '#F9FAFB', // Gray-50
  surfaceDark: '#F3F4F6', // Gray-100
  text: '#0F172A', // Slate-900
  textSecondary: '#475569', // Slate-600
  textTertiary: '#64748B', // Slate-500

  // Semantic
  success: '#059669', // Emerald-600 (money earned)
  warning: '#F59E0B', // Amber-500 (opportunity)
  error: '#DC2626', // Red-600
  info: '#059669', // Emerald-600

  // Gradients
  heroGradient: 'linear-gradient(135deg, #059669, #14B8A6, #F59E0B)', // Emerald → Teal → Amber
  buttonGradient: 'linear-gradient(135deg, #059669, #10B981)', // Emerald → Light Emerald
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const TYPOGRAPHY = {
  // Display / Hero Headings (h1)
  display: {
    desktop: 'text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight',
    mobile: 'text-4xl font-bold leading-tight',
  },

  // Heading 2 (Large sections)
  h2: {
    desktop: 'text-3xl sm:text-4xl font-bold leading-snug',
    mobile: 'text-2xl font-bold leading-snug',
  },

  // Heading 3 (Subsections)
  h3: {
    desktop: 'text-2xl font-bold',
    mobile: 'text-xl font-bold',
  },

  // Heading 4
  h4: {
    desktop: 'text-xl font-semibold',
    mobile: 'text-lg font-semibold',
  },

  // Body Text
  body: {
    base: 'text-base leading-relaxed',
    large: 'text-lg leading-relaxed',
    small: 'text-sm leading-relaxed',
  },

  // Button Text
  button: {
    base: 'text-sm font-semibold',
    large: 'text-base font-semibold',
  },

  // Caption / Small Text
  caption: {
    base: 'text-sm font-medium',
    small: 'text-xs font-medium',
  },

  // Labels
  label: 'text-xs font-semibold uppercase tracking-wider',
};

// ============================================================================
// SPACING SYSTEM (8px base unit)
// ============================================================================

export const SPACING = {
  // Micro spacing
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px

  // Padding presets
  padding: {
    card: 'p-5', // 20px
    section: 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20',
    sectionLarge: 'px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32',
  },

  // Gap presets
  gap: {
    tight: 'gap-2', // 8px
    base: 'gap-4', // 16px
    relaxed: 'gap-6', // 24px
    loose: 'gap-8', // 32px
  },

  // Common section padding
  sectionPadding: 'py-12 sm:py-16 lg:py-20',
  sectionPaddingLarge: 'py-16 sm:py-24 lg:py-32',
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  button: 'rounded-lg', // 8px
  card: 'rounded-lg', // 8px
  input: 'rounded-lg', // 8px
  subtle: 'rounded-md', // 6px
  badge: 'rounded-full', // 9999px
  hero: 'rounded-2xl', // 16px
};

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
  sm: 'shadow-sm',
  base: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',

  // Interactive shadows
  hover: 'shadow-lg hover:shadow-xl transition-shadow',
  card: 'shadow-md hover:shadow-lg transition-shadow',

  // Glassmorphism
  glass: 'backdrop-blur-xl bg-white/10',
};

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const TRANSITIONS = {
  fast: 'transition-all duration-150 ease-out',
  base: 'transition-all duration-300 ease-out',
  slow: 'transition-all duration-500 ease-out',

  // Specific transitions
  colors: 'transition-colors duration-300',
  scale: 'transition-transform duration-300',
  opacity: 'transition-opacity duration-300',
};

// ============================================================================
// UTILITIES
// ============================================================================

export const UTILITIES = {
  // Container
  container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  containerSmall: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',

  // Flexbox centers
  centerFlex: 'flex items-center justify-center',
  centerContent: 'flex flex-col items-center justify-center',

  // Grid
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridTwoCol: 'grid grid-cols-1 md:grid-cols-2 gap-6',

  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2',

  // Clearfix
  clearfix: 'overflow-hidden',

  // Visually hidden
  srOnly: 'sr-only',
};

// ============================================================================
// HELPER FUNCTION: Get colors by blog type
// ============================================================================

export type BlogType = 'crypto' | 'intelligence' | 'onlinebiz';

export function getColorsByBlog(blog: BlogType) {
  switch (blog) {
    case 'crypto':
      return CRYPTO_COLORS;
    case 'intelligence':
      return INTELLIGENCE_COLORS;
    case 'onlinebiz':
      return ONLINEBIZ_COLORS;
    default:
      return INTELLIGENCE_COLORS; // fallback
  }
}

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const DESIGN_TOKENS = {
  crypto: CRYPTO_COLORS,
  intelligence: INTELLIGENCE_COLORS,
  onlinebiz: ONLINEBIZ_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  utilities: UTILITIES,
};
