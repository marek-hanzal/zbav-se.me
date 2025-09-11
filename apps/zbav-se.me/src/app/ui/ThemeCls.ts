import { PicoCls } from "@use-pico/client";

export const ThemeCls = PicoCls.extend(
	{
		tokens: [],
		slot: [],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({
			"round.xl": what.css([
				"rounded-4xl",
			]),
			/**
			 * Color Palette Overrides:
			 * Primary: Pink-based palette (soft pink shades)
			 * Secondary: Purple-based palette (complementary to pink)
			 */

			// Primary tone - Pink-based palette
			"tone.primary.light.text": what.css([
				"text-pink-700",
			]),
			"tone.primary.light.text:hover": what.css([
				"hover:text-pink-800",
			]),
			"tone.primary.light.text:focus": what.css([
				"focus:text-pink-800",
			]),
			"tone.primary.light.bg": what.css([
				"bg-pink-100",
			]),
			"tone.primary.light.bg:hover": what.css([
				"hover:bg-pink-200",
			]),
			"tone.primary.light.bg:focus": what.css([
				"focus:bg-pink-200",
			]),
			"tone.primary.light.bg:even": what.css([
				"even:bg-pink-100",
			]),
			"tone.primary.light.bg:odd": what.css([
				"odd:bg-pink-50",
			]),
			"tone.primary.light.border": what.css([
				"border-pink-200/60",
				"border-b-pink-200",
			]),
			"tone.primary.light.border:hover": what.css([
				"hover:border-pink-300/60",
				"hover:border-b-pink-300",
			]),
			"tone.primary.light.border:focus": what.css([
				"focus:border-pink-300/60",
				"focus:border-b-pink-300",
			]),
			"tone.primary.light.border:group-hover": what.css([
				"group-hover:border-pink-300/60",
				"group-hover:border-b-pink-300",
			]),
			"tone.primary.light.shadow": what.css([
				"shadow-pink-200/50",
			]),
			"tone.primary.light.shadow:hover": what.css([
				"hover:shadow-pink-300/60",
			]),
			"tone.primary.light.shadow:focus": what.css([
				"focus:shadow-pink-300/60",
			]),
			"tone.primary.light.set": what.token([
				"tone.primary.light.text",
				"tone.primary.light.text:hover",
				"tone.primary.light.text:focus",
				"tone.primary.light.bg",
				"tone.primary.light.bg:hover",
				"tone.primary.light.bg:focus",
				"tone.primary.light.border",
				"tone.primary.light.border:hover",
				"tone.primary.light.border:focus",
				"tone.primary.light.border:group-hover",
				"tone.primary.light.shadow",
				"tone.primary.light.shadow:hover",
				"tone.primary.light.shadow:focus",
			]),
			//
			"tone.primary.dark.text": what.css([
				"text-pink-100",
			]),
			"tone.primary.dark.text:hover": what.css([
				"hover:text-pink-50",
			]),
			"tone.primary.dark.text:focus": what.css([
				"focus:text-pink-50",
			]),
			"tone.primary.dark.bg": what.css([
				"bg-pink-900/90",
			]),
			"tone.primary.dark.bg:hover": what.css([
				"hover:bg-pink-800/90",
			]),
			"tone.primary.dark.bg:focus": what.css([
				"focus:bg-pink-800/90",
			]),
			"tone.primary.dark.bg:even": what.css([
				"even:bg-pink-800/80",
			]),
			"tone.primary.dark.bg:odd": what.css([
				"odd:bg-pink-950/90",
			]),
			"tone.primary.dark.border": what.css([
				"border-pink-500/60",
				"border-b-pink-500/80",
			]),
			"tone.primary.dark.border:hover": what.css([
				"hover:border-pink-400/70",
				"hover:border-b-pink-400/90",
			]),
			"tone.primary.dark.border:focus": what.css([
				"focus:border-pink-400/70",
				"focus:border-b-pink-400/90",
			]),
			"tone.primary.dark.border:group-hover": what.css([
				"group-hover:border-pink-400/70",
				"group-hover:border-b-pink-400/90",
			]),
			"tone.primary.dark.shadow": what.css([
				"shadow-pink-900/40",
			]),
			"tone.primary.dark.shadow:hover": what.css([
				"hover:shadow-pink-800/50",
			]),
			"tone.primary.dark.shadow:focus": what.css([
				"focus:shadow-pink-800/50",
			]),
			"tone.primary.dark.set": what.token([
				"tone.primary.dark.text",
				"tone.primary.dark.text:hover",
				"tone.primary.dark.text:focus",
				"tone.primary.dark.bg",
				"tone.primary.dark.bg:hover",
				"tone.primary.dark.bg:focus",
				"tone.primary.dark.border",
				"tone.primary.dark.border:hover",
				"tone.primary.dark.border:focus",
				"tone.primary.dark.border:group-hover",
				"tone.primary.dark.shadow",
				"tone.primary.dark.shadow:hover",
				"tone.primary.dark.shadow:focus",
			]),

			// Secondary tone - Purple-based palette (complementary to pink)
			"tone.secondary.light.text": what.css([
				"text-purple-700",
			]),
			"tone.secondary.light.text:hover": what.css([
				"hover:text-purple-800",
			]),
			"tone.secondary.light.text:focus": what.css([
				"focus:text-purple-800",
			]),
			"tone.secondary.light.bg": what.css([
				"bg-purple-100",
			]),
			"tone.secondary.light.bg:hover": what.css([
				"hover:bg-purple-200",
			]),
			"tone.secondary.light.bg:focus": what.css([
				"focus:bg-purple-200",
			]),
			"tone.secondary.light.bg:even": what.css([
				"even:bg-purple-100",
			]),
			"tone.secondary.light.bg:odd": what.css([
				"odd:bg-purple-50",
			]),
			"tone.secondary.light.border": what.css([
				"border-purple-200/60",
				"border-b-purple-200",
			]),
			"tone.secondary.light.border:hover": what.css([
				"hover:border-purple-300/60",
				"hover:border-b-purple-300",
			]),
			"tone.secondary.light.border:focus": what.css([
				"focus:border-purple-300/60",
				"focus:border-b-purple-300",
			]),
			"tone.secondary.light.border:group-hover": what.css([
				"group-hover:border-purple-300/60",
				"group-hover:border-b-purple-300",
			]),
			"tone.secondary.light.shadow": what.css([
				"shadow-purple-200/50",
			]),
			"tone.secondary.light.shadow:hover": what.css([
				"hover:shadow-purple-300/60",
			]),
			"tone.secondary.light.shadow:focus": what.css([
				"focus:shadow-purple-300/60",
			]),
			"tone.secondary.light.set": what.token([
				"tone.secondary.light.text",
				"tone.secondary.light.text:hover",
				"tone.secondary.light.text:focus",
				"tone.secondary.light.bg",
				"tone.secondary.light.bg:hover",
				"tone.secondary.light.bg:focus",
				"tone.secondary.light.border",
				"tone.secondary.light.border:hover",
				"tone.secondary.light.border:focus",
				"tone.secondary.light.border:group-hover",
				"tone.secondary.light.shadow",
				"tone.secondary.light.shadow:hover",
				"tone.secondary.light.shadow:focus",
			]),
			//
			"tone.secondary.dark.text": what.css([
				"text-purple-100",
			]),
			"tone.secondary.dark.text:hover": what.css([
				"hover:text-purple-50",
			]),
			"tone.secondary.dark.text:focus": what.css([
				"focus:text-purple-50",
			]),
			"tone.secondary.dark.bg": what.css([
				"bg-purple-900/90",
			]),
			"tone.secondary.dark.bg:hover": what.css([
				"hover:bg-purple-800/90",
			]),
			"tone.secondary.dark.bg:focus": what.css([
				"focus:bg-purple-800/90",
			]),
			"tone.secondary.dark.bg:even": what.css([
				"even:bg-purple-800/80",
			]),
			"tone.secondary.dark.bg:odd": what.css([
				"odd:bg-purple-950/90",
			]),
			"tone.secondary.dark.border": what.css([
				"border-purple-500/60",
				"border-b-purple-500/80",
			]),
			"tone.secondary.dark.border:hover": what.css([
				"hover:border-purple-400/70",
				"hover:border-b-purple-400/90",
			]),
			"tone.secondary.dark.border:focus": what.css([
				"focus:border-purple-400/70",
				"focus:border-b-purple-400/90",
			]),
			"tone.secondary.dark.border:group-hover": what.css([
				"group-hover:border-purple-400/70",
				"group-hover:border-b-purple-400/90",
			]),
			"tone.secondary.dark.shadow": what.css([
				"shadow-purple-900/40",
			]),
			"tone.secondary.dark.shadow:hover": what.css([
				"hover:shadow-purple-800/50",
			]),
			"tone.secondary.dark.shadow:focus": what.css([
				"focus:shadow-purple-800/50",
			]),
			"tone.secondary.dark.set": what.token([
				"tone.secondary.dark.text",
				"tone.secondary.dark.text:hover",
				"tone.secondary.dark.text:focus",
				"tone.secondary.dark.bg",
				"tone.secondary.dark.bg:hover",
				"tone.secondary.dark.bg:focus",
				"tone.secondary.dark.border",
				"tone.secondary.dark.border:hover",
				"tone.secondary.dark.border:focus",
				"tone.secondary.dark.border:group-hover",
				"tone.secondary.dark.shadow",
				"tone.secondary.dark.shadow:hover",
				"tone.secondary.dark.shadow:focus",
			]),
		}),
		rules: [],
		defaults: def.defaults({}),
	}),
);

export type ThemeCls = typeof ThemeCls;
