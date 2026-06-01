/**
 * SHOPPER — Design Tokens (JS/TS)
 * Use these in Next.js components, inline styles,
 * or anywhere Tailwind classes can't reach.
 *
 * Usage:
 *   import { colors, gradients, typography } from '@/lib/tokens';
 */

export const gradients = {
  /** Blue → purple. Use on primary buttons, active nav items */
  primary:     'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',

  /** Blue → purple → pink. Use on sign up page background, hero sections */
  hero:        'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',

  /** Dark indigo. Use on landing page dark hero section */
  darkHero:    'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',

  /** Soft purple/pink wash. Use on light cards */
  card:        'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',

  /** Stat card tints */
  statBlue:    'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  statGreen:   'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  statPurple:  'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
  statPink:    'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)',

  /** Use with background-clip: text for gradient headlines */
  text:        'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',

  /** CTA button on light background */
  btnPrimary:  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',

  /** CTA button on dark background */
  btnDark:     'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
} as const;


export const colors = {
  brand: {
    50:  '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',   // primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  accent: {
    400: '#f472b6',
    500: '#ec4899',   // pink
    600: '#db2777',
  },

  purple: {
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
  },

  neutral: {
    0:   '#ffffff',
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#3b82f6',
  },

  status: {
    published: { bg: '#dcfce7', text: '#15803d' },
    draft:     { bg: '#f1f5f9', text: '#475569' },
    outOfStock:{ bg: '#fee2e2', text: '#b91c1c' },
  },

  sidebar: {
    bg:         '#ffffff',
    activeBg:   '#ede9fe',
    activeText: '#4f46e5',
    text:       '#64748b',
    hoverBg:    '#f8fafc',
  },
} as const;


export const typography = {
  fonts: {
    display: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
    body:    "'Inter', 'DM Sans', sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', monospace",
  },

  sizes: {
    '2xs': '0.625rem',   // 10px
    xs:    '0.75rem',    // 12px
    sm:    '0.875rem',   // 14px
    md:    '1rem',       // 16px
    lg:    '1.125rem',   // 18px
    xl:    '1.25rem',    // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
    '5xl': '3rem',       // 48px
    '6xl': '3.75rem',    // 60px
  },

  weights: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  leading: {
    tight:   1.25,
    snug:    1.375,
    normal:  1.5,
    relaxed: 1.625,
  },

  tracking: {
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const;


export const radius = {
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  xl:   '18px',
  '2xl':'24px',
  full: '9999px',
} as const;


export const shadows = {
  card:     '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  dropdown: '0 8px 24px rgba(0,0,0,0.10)',
  modal:    '0 20px 60px rgba(0,0,0,0.15)',
  btn:      '0 4px 14px rgba(99,102,241,0.35)',
} as const;


export const layout = {
  sidebarWidth:          '220px',
  sidebarWidthCollapsed: '64px',
  topbarHeight:          '64px',
} as const;


/** Convenience: everything in one export */
const tokens = { gradients, colors, typography, radius, shadows, layout };
export default tokens;