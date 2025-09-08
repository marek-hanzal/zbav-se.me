import { addDynamicIconSelectors } from "@iconify/tailwind";

export default {
	content: [
        './src/**/*.{ts,tsx}',
		"../../packages/**/*.{ts,tsx}",
	],
	important: true,
	plugins: [
		addDynamicIconSelectors(),
	],
};
