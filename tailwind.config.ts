import { addDynamicIconSelectors } from "@iconify/tailwind";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	plugins: [animate, addDynamicIconSelectors()],
} satisfies Config;
