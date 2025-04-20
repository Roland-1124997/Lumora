export const darkMode = 'class';
export const theme = {
    extend: {
        animation: {
            like: 'like 0.6s ease-in-out', // unieke like-animatie
        },
        keyframes: {
            like: {
                '0%': { transform: 'scale(1)', opacity: '1' },
                '10%': { transform: 'scale(1.2)', opacity: '0.9' },
                '30%': { transform: 'scale(0.9)', opacity: '1' },
                '50%': { transform: 'scale(1.3)', opacity: '1' },
                '70%': { transform: 'scale(1.1)', opacity: '0.95' },
                '100%': { transform: 'scale(1)', opacity: '1' },
            },
        },
    },
};