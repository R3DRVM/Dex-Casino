/** @type {import('tailwindcss').Config} */
module.exports = {
	daisyui: {
		themes: [
			{
				mytheme: {
					"primary": "#d20202",
					"secondary": "#f6f4f4",
					"accent": "#2563eb",
					"neutral": "#a58d00",
					"base-100": "#1c1917",
					"info": "#63B6CF",
					"success": "#54E88D",
					"warning": "#F0A119",
					"error": "#F0606F",
				},
			},
		],
	},
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
