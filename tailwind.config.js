// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#004AAD', 
          secondary: '#00C2FF', 
        },
        surface: {
          base: '#FFFFFF',
          muted: '#F2F3F2', 
        },
        text: {
          primary: '#181725', 
          secondary: '#7C7C7C', 
        },
        status: {
          success: '#53B175', 
        },
      },
      borderRadius: {
        'md': '18px', 
      }
    },
  },
  plugins: [],
}