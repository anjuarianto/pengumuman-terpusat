import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  options: {
    safelist: [/^ck-/],
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'sm': "640px",
        'md': "768px",
        'lg': "1024px",
        'xl': "1280px",
        '2xl': '1536px',
      },
      colors: {
        'link-blue': '#9ccbe2',
        'gray-1':'#292e32',
        'gray-2':'#40474f',
        'gray-3':'#535a61',
        'main-1':'#eff4fb',
        'main-2':'#dae2f0',
        'main-3':'#535a61',
        'main-4':'#20abfc',
        'dark-blue':'#2B507C',
        'dark-blue-h':'#346195',
        'light-blue':'#DCEBF7',
        'orange':'#D68E3D',
        'orange-h':'#E89A42',
        
      },
    },
  },
  plugins: [],
};
export default config;
