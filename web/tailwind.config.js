/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn:     { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeInFast: { from: { opacity: 0, transform: 'translateY(4px)'  }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:      { '0%,100%': { transform: 'translateY(0)'  }, '50%': { transform: 'translateY(-8px)' } },
        orbPulse:   { '0%,100%': { transform: 'scale(1) translate(0,0)' }, '33%': { transform: 'scale(1.05) translate(12px,-8px)' }, '66%': { transform: 'scale(.97) translate(-8px,10px)' } },
        spin:       { to: { transform: 'rotate(360deg)' } },
        slideUp:    { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn:     'fadeIn .3s ease forwards',
        fadeInFast: 'fadeInFast .18s ease forwards',
        float:      'float 4s ease-in-out infinite',
        orbPulse:   'orbPulse 12s ease-in-out infinite',
        spin:       'spin .7s linear infinite',
        slideUp:    'slideUp .5s ease forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
