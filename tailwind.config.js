import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Bật Dark Mode qua class 'dark' ở body
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
              "primary": "#4647d3",
              "primary-dim": "#3939c7",
              "primary-fixed": "#9396ff",
              "primary-fixed-dim": "#8387ff",
              "on-primary": "#f4f1ff",
              "on-primary-container": "#0a0081",
              "on-primary-fixed": "#000000",
              "on-primary-fixed-variant": "#0e009d",
              "primary-container": "#9396ff",
              "inverse-primary": "#8083ff",

              "secondary": "#6a37d4",
              "secondary-dim": "#5e26c7",
              "secondary-fixed": "#dac9ff",
              "secondary-fixed-dim": "#ceb9ff",
              "on-secondary": "#f8f0ff",
              "on-secondary-container": "#5517bf",
              "on-secondary-fixed": "#40009b",
              "on-secondary-fixed-variant": "#5f28c8",
              "secondary-container": "#dac9ff",

              "tertiary": "#963776",
              "tertiary-dim": "#882a69",
              "tertiary-fixed": "#ff8ed2",
              "tertiary-fixed-dim": "#ef81c4",
              "on-tertiary": "#ffeef4",
              "on-tertiary-container": "#63054a",
              "on-tertiary-fixed": "#3b002b",
              "on-tertiary-fixed-variant": "#6e1354",
              "tertiary-container": "#ff8ed2",

              "error": "#b41340",
              "error-dim": "#a70138",
              "on-error": "#ffefef",
              "on-error-container": "#510017",
              "error-container": "#f74b6d",

              "background": "var(--background)",
              "on-background": "var(--on-surface)",
              "surface": "var(--background)",
              "on-surface": "var(--on-surface)",
              "surface-variant": "var(--surface-container-highest)",
              "on-surface-variant": "var(--on-surface-variant)",
              "surface-dim": "var(--surface-container-low)",
              "surface-bright": "var(--background)",
              "surface-container-lowest": "var(--surface-container-lowest)",
              "surface-container-low": "var(--surface-container-low)",
              "surface-container": "var(--surface-container)",
              "surface-container-high": "var(--surface-container-high)",
              "surface-container-highest": "var(--surface-container-highest)",
              "surface-tint": "#4647d3",

              "inverse-surface": "var(--on-surface)",
              "inverse-on-surface": "var(--background)",
              "outline": "var(--outline)",
              "outline-variant": "var(--outline-variant)",
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                headline: ["Plus Jakarta Sans", "sans-serif"],
                body: ["Inter", "sans-serif"],
                label: ["Inter", "sans-serif"]
            },
            borderRadius: {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "2xl": "1.5rem",
              "full": "9999px"
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(15px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }
        },
    },

    plugins: [forms, containerQueries],
};
