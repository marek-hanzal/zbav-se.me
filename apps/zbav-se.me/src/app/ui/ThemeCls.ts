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
			 * Color Switching Overrides:
			 * danger -> primary, warning -> secondary, primary -> danger, secondary -> warning
			 */
			
			// Primary tone now uses danger colors (rose/red)
			"tone.primary.light.text": what.css([
				"text-rose-700",
			]),
			"tone.primary.light.text:hover": what.css([
				"hover:text-rose-800",
			]),
			"tone.primary.light.text:focus": what.css([
				"focus:text-rose-800",
			]),
			"tone.primary.light.bg": what.css([
				"bg-rose-100",
			]),
			"tone.primary.light.bg:hover": what.css([
				"hover:bg-rose-200",
			]),
			"tone.primary.light.bg:focus": what.css([
				"focus:bg-rose-200",
			]),
			"tone.primary.light.bg:even": what.css([
				"even:bg-rose-100",
			]),
			"tone.primary.light.bg:odd": what.css([
				"odd:bg-rose-50",
			]),
			"tone.primary.light.border": what.css([
				"border-rose-200/60",
				"border-b-rose-200",
			]),
			"tone.primary.light.border:hover": what.css([
				"hover:border-rose-300/60",
				"hover:border-b-rose-300",
			]),
			"tone.primary.light.border:focus": what.css([
				"focus:border-rose-300/60",
				"focus:border-b-rose-300",
			]),
			"tone.primary.light.border:group-hover": what.css([
				"group-hover:border-rose-300/60",
				"group-hover:border-b-rose-300",
			]),
			"tone.primary.light.shadow": what.css([
				"shadow-rose-200/50",
			]),
			"tone.primary.light.shadow:hover": what.css([
				"hover:shadow-rose-300/60",
			]),
			"tone.primary.light.shadow:focus": what.css([
				"focus:shadow-rose-300/60",
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
				"text-rose-100",
			]),
			"tone.primary.dark.text:hover": what.css([
				"hover:text-rose-50",
			]),
			"tone.primary.dark.text:focus": what.css([
				"focus:text-rose-50",
			]),
			"tone.primary.dark.bg": what.css([
				"bg-rose-900/90",
			]),
			"tone.primary.dark.bg:hover": what.css([
				"hover:bg-rose-800/90",
			]),
			"tone.primary.dark.bg:focus": what.css([
				"focus:bg-rose-800/90",
			]),
			"tone.primary.dark.bg:even": what.css([
				"even:bg-rose-800/80",
			]),
			"tone.primary.dark.bg:odd": what.css([
				"odd:bg-rose-950/90",
			]),
			"tone.primary.dark.border": what.css([
				"border-rose-500/60",
				"border-b-rose-500/80",
			]),
			"tone.primary.dark.border:hover": what.css([
				"hover:border-rose-400/70",
				"hover:border-b-rose-400/90",
			]),
			"tone.primary.dark.border:focus": what.css([
				"focus:border-rose-400/70",
				"focus:border-b-rose-400/90",
			]),
			"tone.primary.dark.border:group-hover": what.css([
				"group-hover:border-rose-400/70",
				"group-hover:border-b-rose-400/90",
			]),
			"tone.primary.dark.shadow": what.css([
				"shadow-rose-900/40",
			]),
			"tone.primary.dark.shadow:hover": what.css([
				"hover:shadow-rose-800/50",
			]),
			"tone.primary.dark.shadow:focus": what.css([
				"focus:shadow-rose-800/50",
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

			// Secondary tone now uses warning colors (amber/orange)
			"tone.secondary.light.text": what.css([
				"text-amber-700",
			]),
			"tone.secondary.light.text:hover": what.css([
				"hover:text-amber-800",
			]),
			"tone.secondary.light.text:focus": what.css([
				"focus:text-amber-800",
			]),
			"tone.secondary.light.bg": what.css([
				"bg-amber-100",
			]),
			"tone.secondary.light.bg:hover": what.css([
				"hover:bg-amber-200",
			]),
			"tone.secondary.light.bg:focus": what.css([
				"focus:bg-amber-200",
			]),
			"tone.secondary.light.bg:even": what.css([
				"even:bg-amber-100",
			]),
			"tone.secondary.light.bg:odd": what.css([
				"odd:bg-amber-50",
			]),
			"tone.secondary.light.border": what.css([
				"border-amber-200/60",
				"border-b-amber-200",
			]),
			"tone.secondary.light.border:hover": what.css([
				"hover:border-amber-300/60",
				"hover:border-b-amber-300",
			]),
			"tone.secondary.light.border:focus": what.css([
				"focus:border-amber-300/60",
				"focus:border-b-amber-300",
			]),
			"tone.secondary.light.border:group-hover": what.css([
				"group-hover:border-amber-300/60",
				"group-hover:border-b-amber-300",
			]),
			"tone.secondary.light.shadow": what.css([
				"shadow-amber-200/50",
			]),
			"tone.secondary.light.shadow:hover": what.css([
				"hover:shadow-amber-300/60",
			]),
			"tone.secondary.light.shadow:focus": what.css([
				"focus:shadow-amber-300/60",
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
				"text-amber-100",
			]),
			"tone.secondary.dark.text:hover": what.css([
				"hover:text-amber-50",
			]),
			"tone.secondary.dark.text:focus": what.css([
				"focus:text-amber-50",
			]),
			"tone.secondary.dark.bg": what.css([
				"bg-amber-900/90",
			]),
			"tone.secondary.dark.bg:hover": what.css([
				"hover:bg-amber-800/90",
			]),
			"tone.secondary.dark.bg:focus": what.css([
				"focus:bg-amber-800/90",
			]),
			"tone.secondary.dark.bg:even": what.css([
				"even:bg-amber-800/80",
			]),
			"tone.secondary.dark.bg:odd": what.css([
				"odd:bg-amber-950/90",
			]),
			"tone.secondary.dark.border": what.css([
				"border-amber-500/60",
				"border-b-amber-500/80",
			]),
			"tone.secondary.dark.border:hover": what.css([
				"hover:border-amber-400/70",
				"hover:border-b-amber-400/90",
			]),
			"tone.secondary.dark.border:focus": what.css([
				"focus:border-amber-400/70",
				"focus:border-b-amber-400/90",
			]),
			"tone.secondary.dark.border:group-hover": what.css([
				"group-hover:border-amber-400/70",
				"group-hover:border-b-amber-400/90",
			]),
			"tone.secondary.dark.shadow": what.css([
				"shadow-amber-900/40",
			]),
			"tone.secondary.dark.shadow:hover": what.css([
				"hover:shadow-amber-800/50",
			]),
			"tone.secondary.dark.shadow:focus": what.css([
				"focus:shadow-amber-800/50",
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

			// Danger tone now uses primary colors (indigo/purple)
			"tone.danger.light.text": what.css([
				"text-indigo-700",
			]),
			"tone.danger.light.text:hover": what.css([
				"hover:text-indigo-800",
			]),
			"tone.danger.light.text:focus": what.css([
				"focus:text-indigo-800",
			]),
			"tone.danger.light.bg": what.css([
				"bg-indigo-100",
			]),
			"tone.danger.light.bg:hover": what.css([
				"hover:bg-indigo-200",
			]),
			"tone.danger.light.bg:focus": what.css([
				"focus:bg-indigo-200",
			]),
			"tone.danger.light.bg:even": what.css([
				"even:bg-indigo-100",
			]),
			"tone.danger.light.bg:odd": what.css([
				"odd:bg-indigo-50",
			]),
			"tone.danger.light.border": what.css([
				"border-indigo-200/60",
				"border-b-indigo-200",
			]),
			"tone.danger.light.border:hover": what.css([
				"hover:border-indigo-300/60",
				"hover:border-b-indigo-300",
			]),
			"tone.danger.light.border:focus": what.css([
				"focus:border-indigo-300/60",
				"focus:border-b-indigo-300",
			]),
			"tone.danger.light.border:group-hover": what.css([
				"group-hover:border-indigo-300/60",
				"group-hover:border-b-indigo-300",
			]),
			"tone.danger.light.shadow": what.css([
				"shadow-indigo-200/50",
			]),
			"tone.danger.light.shadow:hover": what.css([
				"hover:shadow-indigo-300/60",
			]),
			"tone.danger.light.shadow:focus": what.css([
				"focus:shadow-indigo-300/60",
			]),
			"tone.danger.light.set": what.token([
				"tone.danger.light.text",
				"tone.danger.light.text:hover",
				"tone.danger.light.text:focus",
				"tone.danger.light.bg",
				"tone.danger.light.bg:hover",
				"tone.danger.light.bg:focus",
				"tone.danger.light.border",
				"tone.danger.light.border:hover",
				"tone.danger.light.border:focus",
				"tone.danger.light.border:group-hover",
				"tone.danger.light.shadow",
				"tone.danger.light.shadow:hover",
				"tone.danger.light.shadow:focus",
			]),
			//
			"tone.danger.dark.text": what.css([
				"text-violet-100",
			]),
			"tone.danger.dark.text:hover": what.css([
				"hover:text-violet-50",
			]),
			"tone.danger.dark.text:focus": what.css([
				"focus:text-violet-50",
			]),
			"tone.danger.dark.bg": what.css([
				"bg-violet-900/90",
			]),
			"tone.danger.dark.bg:hover": what.css([
				"hover:bg-violet-800/90",
			]),
			"tone.danger.dark.bg:focus": what.css([
				"focus:bg-violet-800/90",
			]),
			"tone.danger.dark.bg:even": what.css([
				"even:bg-violet-800/80",
			]),
			"tone.danger.dark.bg:odd": what.css([
				"odd:bg-violet-950/90",
			]),
			"tone.danger.dark.border": what.css([
				"border-violet-400/60",
				"border-b-violet-400/80",
			]),
			"tone.danger.dark.border:hover": what.css([
				"hover:border-violet-300/70",
				"hover:border-b-violet-300/90",
			]),
			"tone.danger.dark.border:focus": what.css([
				"focus:border-violet-300/70",
				"focus:border-b-violet-300/90",
			]),
			"tone.danger.dark.border:group-hover": what.css([
				"group-hover:border-violet-300/70",
				"group-hover:border-b-violet-300/90",
			]),
			"tone.danger.dark.shadow": what.css([
				"shadow-violet-900/40",
			]),
			"tone.danger.dark.shadow:hover": what.css([
				"hover:shadow-violet-800/50",
			]),
			"tone.danger.dark.shadow:focus": what.css([
				"focus:shadow-violet-800/50",
			]),
			"tone.danger.dark.set": what.token([
				"tone.danger.dark.text",
				"tone.danger.dark.text:hover",
				"tone.danger.dark.text:focus",
				"tone.danger.dark.bg",
				"tone.danger.dark.bg:hover",
				"tone.danger.dark.bg:focus",
				"tone.danger.dark.border",
				"tone.danger.dark.border:hover",
				"tone.danger.dark.border:focus",
				"tone.danger.dark.border:group-hover",
				"tone.danger.dark.shadow",
				"tone.danger.dark.shadow:hover",
				"tone.danger.dark.shadow:focus",
			]),

			// Warning tone now uses secondary colors (teal/cyan)
			"tone.warning.light.text": what.css([
				"text-teal-700",
			]),
			"tone.warning.light.text:hover": what.css([
				"hover:text-teal-800",
			]),
			"tone.warning.light.text:focus": what.css([
				"focus:text-teal-800",
			]),
			"tone.warning.light.bg": what.css([
				"bg-teal-100",
			]),
			"tone.warning.light.bg:hover": what.css([
				"hover:bg-teal-200",
			]),
			"tone.warning.light.bg:focus": what.css([
				"focus:bg-teal-200",
			]),
			"tone.warning.light.bg:even": what.css([
				"even:bg-teal-100",
			]),
			"tone.warning.light.bg:odd": what.css([
				"odd:bg-teal-50",
			]),
			"tone.warning.light.border": what.css([
				"border-teal-200/60",
				"border-b-teal-200",
			]),
			"tone.warning.light.border:hover": what.css([
				"hover:border-teal-300/60",
				"hover:border-b-teal-300",
			]),
			"tone.warning.light.border:focus": what.css([
				"focus:border-teal-300/60",
				"focus:border-b-teal-300",
			]),
			"tone.warning.light.border:group-hover": what.css([
				"group-hover:border-teal-300/60",
				"group-hover:border-b-teal-300",
			]),
			"tone.warning.light.shadow": what.css([
				"shadow-teal-200/50",
			]),
			"tone.warning.light.shadow:hover": what.css([
				"hover:shadow-teal-300/60",
			]),
			"tone.warning.light.shadow:focus": what.css([
				"focus:shadow-teal-300/60",
			]),
			"tone.warning.light.set": what.token([
				"tone.warning.light.text",
				"tone.warning.light.text:hover",
				"tone.warning.light.text:focus",
				"tone.warning.light.bg",
				"tone.warning.light.bg:hover",
				"tone.warning.light.bg:focus",
				"tone.warning.light.border",
				"tone.warning.light.border:hover",
				"tone.warning.light.border:focus",
				"tone.warning.light.border:group-hover",
				"tone.warning.light.shadow",
				"tone.warning.light.shadow:hover",
				"tone.warning.light.shadow:focus",
			]),
			//
			"tone.warning.dark.text": what.css([
				"text-cyan-100",
			]),
			"tone.warning.dark.text:hover": what.css([
				"hover:text-cyan-50",
			]),
			"tone.warning.dark.text:focus": what.css([
				"focus:text-cyan-50",
			]),
			"tone.warning.dark.bg": what.css([
				"bg-teal-900/90",
			]),
			"tone.warning.dark.bg:hover": what.css([
				"hover:bg-teal-800/90",
			]),
			"tone.warning.dark.bg:focus": what.css([
				"focus:bg-teal-800/90",
			]),
			"tone.warning.dark.bg:even": what.css([
				"even:bg-teal-800/80",
			]),
			"tone.warning.dark.bg:odd": what.css([
				"odd:bg-teal-950/90",
			]),
			"tone.warning.dark.border": what.css([
				"border-teal-500/60",
				"border-b-teal-500/80",
			]),
			"tone.warning.dark.border:hover": what.css([
				"hover:border-teal-400/70",
				"hover:border-b-teal-400/90",
			]),
			"tone.warning.dark.border:focus": what.css([
				"focus:border-teal-400/70",
				"focus:border-b-teal-400/90",
			]),
			"tone.warning.dark.border:group-hover": what.css([
				"group-hover:border-teal-400/70",
				"group-hover:border-b-teal-400/90",
			]),
			"tone.warning.dark.shadow": what.css([
				"shadow-teal-900/40",
			]),
			"tone.warning.dark.shadow:hover": what.css([
				"hover:shadow-teal-800/50",
			]),
			"tone.warning.dark.shadow:focus": what.css([
				"focus:shadow-teal-800/50",
			]),
			"tone.warning.dark.set": what.token([
				"tone.warning.dark.text",
				"tone.warning.dark.text:hover",
				"tone.warning.dark.text:focus",
				"tone.warning.dark.bg",
				"tone.warning.dark.bg:hover",
				"tone.warning.dark.bg:focus",
				"tone.warning.dark.border",
				"tone.warning.dark.border:hover",
				"tone.warning.dark.border:focus",
				"tone.warning.dark.border:group-hover",
				"tone.warning.dark.shadow",
				"tone.warning.dark.shadow:hover",
				"tone.warning.dark.shadow:focus",
			]),
		}),
		rules: [],
		defaults: def.defaults({}),
	}),
);

export type ThemeCls = typeof ThemeCls;
