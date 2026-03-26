/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.{svelte,html,js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Brand Colors - KlikAja Identity
        brand: {
          // Primary: Vibrant Orange - Energy, action, speed
          orange: {
            50: '#fff5f0',
            100: '#ffe8d9',
            200: '#ffcfb3',
            300: '#ffa680',
            400: '#ff8559',
            500: '#FF6B35', // PRIMARY BRAND COLOR
            600: '#e55a2b',
            700: '#cc4a22',
            800: '#b23d1e',
            900: '#99331a',
            950: '#4d1a0d',
          },
          // Secondary: Deep Blue - Trust, professional, stability
          blue: {
            50: '#f0f4f8',
            100: '#d9e2ec',
            200: '#bcccdc',
            300: '#9fb3c8',
            400: '#829ab1',
            500: '#627d98',
            600: '#486581',
            700: '#334e68',
            800: '#243b53',
            900: '#102a43', // PRIMARY DARK
            950: '#081526',
          },
          // Accent: Bright Cyan - Modern, tech-forward
          cyan: {
            50: '#ecfdff',
            100: '#cff9fc',
            200: '#a4f0f9',
            300: '#67e2f5',
            400: '#2cd1ed',
            500: '#00D9FF', // ACCENT COLOR
            600: '#00b8d9',
            700: '#0099b3',
            800: '#007a8c',
            900: '#005c66',
            950: '#003338',
          },
          // Dark: Dark Navy - Elegance, contrast
          navy: {
            50: '#f0f0f5',
            100: '#d9d9e5',
            200: '#bfbfd9',
            300: '#a3a3c9',
            400: '#8585b3',
            500: '#6b6b99',
            600: '#55557f',
            700: '#404066',
            800: '#2e2e4d',
            900: '#1A1A2E', // DARK MODE BACKGROUND
            950: '#0f0f1a',
          },
        },
        // Legacy aliases for backward compatibility
        primary: {
          50: '#fff5f0',
          100: '#ffe8d9',
          200: '#ffcfb3',
          300: '#ffa680',
          400: '#ff8559',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4a22',
          800: '#b23d1e',
          900: '#99331a',
          950: '#4d1a0d',
        },
        secondary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#081526',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF6B35 0%, #ff8559 50%, #ff5722 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,133,89,0.05) 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #004E89 0%, #0069aa 50%, #0085cc 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FF6B35 0%, #ff8559 50%, #004E89 100%)',
        'hero-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #243b53 50%, #102a43 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'brand': '0 4px 20px -2px rgba(255, 107, 53, 0.3)',
        'brand-lg': '0 8px 30px -4px rgba(255, 107, 53, 0.4)',
        'glow-orange': '0 0 40px -10px rgba(255, 107, 53, 0.5)',
        'glow-cyan': '0 0 40px -10px rgba(0, 217, 255, 0.5)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#0ea5e9',
              '&:hover': {
                color: '#0284c7',
              },
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            'h5, h6': {
              color: 'inherit',
            },
            'ul, ol': {
              'padding-left': '1.25em',
            },
            'ul > li': {
              position: 'relative',
              'padding-left': '1.5em'
            },
            'ol > li': {
              'padding-left': '0.5em',
            },
            // Blockquote styling
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#e5e7eb',
              paddingLeft: '1em',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              p: {
                marginTop: '0.8em',
                marginBottom: '0.8em',
              }
            },
            // Code block styling
            'pre, code': {
              backgroundColor: '#f3f4f6',
              borderRadius: '0.375rem',
              padding: '0.2em 0.4em',
              fontSize: '0.875em',
            },
            pre: {
              padding: '1em',
              overflowX: 'auto',
              code: {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: '400',
                fontSize: 'inherit',
                color: 'inherit',
                fontFamily: 'inherit',
              },
            },
            // Table styling
            table: {
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              borderCollapse: 'collapse',
              'thead, tbody tr': {
                borderBottomWidth: '1px',
                borderBottomColor: '#e5e7eb',
              },
              'thead th': {
                fontWeight: '600',
                textAlign: 'left',
                paddingBottom: '0.5em',
                paddingTop: '0.5em',
                paddingLeft: '0.75em',
                paddingRight: '0.75em',
              },
              'tbody td': {
                paddingTop: '0.5em',
                paddingBottom: '0.5em',
                paddingLeft: '0.75em',
                paddingRight: '0.75em',
              },
            },
            // Horizontal rule
            hr: {
              borderColor: '#e5e7eb',
              marginTop: '3em',
              marginBottom: '3em',
            },
            // Strong and emphasis
            strong: {
              fontWeight: '600',
              color: 'inherit',
            },
            em: {
              fontStyle: 'italic',
              color: 'inherit',
            },
            // Imagea
            img: {
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.375rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
