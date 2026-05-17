export const theme = {
	tailwind: {
		theme: {
			extend: {
				colors: {
					brand: {
						50: "#fdf2f8",
						100: "#fce7f3",
						200: "#fbcfe8",
						300: "#f9a8d4",
						400: "#f472b6",
						500: "#ec4899",
						600: "#db2777",
						700: "#be185d",
						800: "#9d174d",
						900: "#831843",
					},
				},
				borderRadius: {
					"4xl": "2rem",
				},
				boxShadow: {
					card: "0 20px 45px rgba(15, 23, 42, 0.08)",
				},
				fontFamily: {
					sans: [
						"Roboto",
						"Arial",
						"Helvetica",
						"sans-serif",
					],
					display: [
						"Roboto",
						"Arial",
						"Helvetica",
						"sans-serif",
					],
				},
			},
		},
	},
	colors: {
		canvas: "#f8fafc",
		card: "#ffffff",
		cardBorder: "#fbcfe8",
		cardShadow: "rgba(15, 23, 42, 0.08)",
		text: "#0f172a",
		textMuted: "#475569",
		textSoft: "#64748b",
		primary: "#be185d",
		primaryHover: "#9d174d",
		primaryText: "#ffffff",
	},
} as const;
