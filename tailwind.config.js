/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        // All colors now reference CSS variables so dark mode overrides work
        "error-container": "var(--color-error-container)",
        "primary": "var(--color-primary)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "background": "var(--color-background)",
        "inverse-primary": "var(--color-inverse-primary)",
        "primary-fixed": "var(--color-primary-fixed)",
        "surface-container": "var(--color-surface-container)",
        "tertiary": "var(--color-tertiary)",
        "surface-container-low": "var(--color-surface-container-low)",
        "on-secondary": "var(--color-on-secondary)",
        "on-background": "var(--color-on-background)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "surface-dim": "var(--color-surface-dim)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "secondary": "var(--color-secondary)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "inverse-surface": "var(--color-inverse-surface)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "on-surface": "var(--color-on-surface)",
        "surface-tint": "var(--color-surface-tint)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-error-container": "var(--color-on-error-container)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "primary-container": "var(--color-primary-container)",
        "on-tertiary": "var(--color-on-tertiary)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "surface-bright": "var(--color-surface-bright)",
        "on-primary-container": "var(--color-on-primary-container)",
        "surface": "var(--color-surface)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "on-primary": "var(--color-on-primary)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "error": "var(--color-error)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-variant": "var(--color-surface-variant)",
        "on-error": "var(--color-on-error)",
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "fontFamily": {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      animation: {
        'gradient-shift': 'gradientPan 6s ease infinite',
        shakeTrophy: 'shakeTrophy 0.8s ease-in-out infinite',
        ripple: "ripple 0.6s ease-in-out infinite",
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        pulseColor: 'pulseColor 2s ease-in-out infinite',
      },
      keyframes: {
        gradientPan: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shakeTrophy: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'rotate(-15deg) translateY(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'rotate(15deg) translateY(-5px)' },
        },
        ripple: {
          "0%": {
            boxShadow:
              "0 0 0 0 rgba(255,255,255,0.1), 0 0 0 20px rgba(255,255,255,0.1), 0 0 0 40px rgba(255,255,255,0.1), 0 0 0 60px rgba(255,255,255,0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 0 20px rgba(255,255,255,0.1), 0 0 0 40px rgba(255,255,255,0.1), 0 0 0 60px rgba(255,255,255,0.1), 0 0 0 80px rgba(255,255,255,0)",
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseColor: {
          '0%, 100%': { color: '#9FA1FF' }, 
          '50%': { color: '#249E94' },
        },
      }
    },
  },
  plugins: [],
}
