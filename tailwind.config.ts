import type { Config } from 'tailwindcss'

/**
 * Tailwind theme tokens migrated from the legacy Semantic UI Less theme
 * (`src/semantic/site/globals/site.variables`) plus the redesign palette
 * introduced in commit 63bf0c5 (dark navy + light blue two-column layout).
 *
 * Source-of-truth mapping:
 *   navy-950   #061A40  page background      (sidebar + main)
 *   navy-800   #102E4A  card border base
 *   navy-600   #0353A4  accent border / link
 *   sky-200    #B9D6F2  primary heading text
 *   slate-400  #94a3b8  body / muted copy   (WCAG AA bump from #7890a8)
 *   slate-500  #7890a8  legacy muted        (kept for transitional refs)
 *   purple-300 #c49cf7  tech-pill accent
 *   purple-700 #663399  rebeccapurple — Semantic UI legacy @primaryColor
 *
 * Breakpoints mirror Semantic UI's tablet/computer/largeMonitor/widescreen
 * tiers so component layouts port 1:1.
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/pages/**/*.{ts,tsx,js,jsx,mdx}',
    './src/components/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px', // Semantic @tabletBreakpoint
      lg: '992px', // Semantic @computerBreakpoint
      xl: '1200px', // Semantic @largeMonitorBreakpoint
      '2xl': '1920px', // Semantic @widescreenMonitorBreakpoint
    },
    extend: {
      colors: {
        navy: {
          600: '#0353A4',
          800: '#102E4A',
          950: '#061A40',
        },
        sky: {
          200: '#B9D6F2',
        },
        slate: {
          400: '#94a3b8',
          500: '#7890a8',
        },
        purple: {
          300: '#c49cf7',
          700: '#663399', // rebeccapurple / Semantic @primaryColor
        },
        // Semantic palette retained for transitional component refs
        brand: {
          primary: '#663399',
          accent: '#c49cf7',
          surface: '#061A40',
          border: '#0353A4',
          borderMuted: '#102E4A',
          heading: '#B9D6F2',
          body: '#94a3b8',
          bodyLegacy: '#7890a8',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'],
        heading: ['Lato', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        // Semantic @h1..@h5 expressed as rem ratios against @emSize 14px
        h5: ['1rem', { lineHeight: '1.2857em' }],
        h4: ['1.0714rem', { lineHeight: '1.2857em' }],
        h3: ['1.2857rem', { lineHeight: '1.2857em' }],
        h2: ['1.7143rem', { lineHeight: '1.2857em' }],
        h1: ['2rem', { lineHeight: '1.2857em' }],
      },
      borderRadius: {
        DEFAULT: '4px', // Semantic @absoluteBorderRadius / @4px
      },
      lineHeight: {
        base: '1.4285em', // Semantic @lineHeight
      },
      maxWidth: {
        page: '1600px', // Layout .app cap
        sidebar: '480px',
      },
      transitionDuration: {
        DEFAULT: '100ms', // Semantic @defaultDuration 0.1s
      },
      transitionTimingFunction: {
        DEFAULT: 'ease', // Semantic @defaultEasing
      },
    },
  },
  plugins: [],
}

export default config
