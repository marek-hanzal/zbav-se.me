import { PicoCls } from "@use-pico/client";
import { contract } from "@use-pico/cls";

export const ThemeCls = contract(PicoCls.contract)
	.def()
	.token({
		/**
		 * Color Palette Overrides:
		 * Primary: Pink-based palette (soft pink shades)
		 * Secondary: Purple-based palette (complementary to pink)
		 */

		// Primary tone - Pink-based palette
		"tone.primary.light.text": {
			class: [
				"text-pink-800/70",
			],
		},
		"tone.primary.light.text:hover": {
			class: [
				"hover:text-pink-800",
			],
		},
		"tone.primary.light.bg": {
			class: [
				"bg-pink-50",
			],
		},
		"tone.primary.light.bg:hover": {
			class: [
				"hover:bg-pink-200",
			],
		},
		"tone.primary.light.bg:even": {
			class: [
				"even:bg-pink-100",
			],
		},
		"tone.primary.light.bg:odd": {
			class: [
				"odd:bg-pink-50",
			],
		},
		"tone.primary.light.accent": {
			class: [
				"bg-pink-100/50",
			],
		},
		"tone.primary.light.from": {
			class: [
				"from-pink-100/50",
			],
		},
		"tone.primary.light.to": {
			class: [
				"to-pink-100/50",
			],
		},
		"tone.primary.light.border": {
			class: [
				"border-pink-200/60",
				"border-b-pink-200",
			],
		},
		"tone.primary.light.border:hover": {
			class: [
				"hover:border-pink-300/60",
				"hover:border-b-pink-300",
			],
		},
		"tone.primary.light.border:group-hover": {
			class: [
				"group-hover:border-pink-300/60",
				"group-hover:border-b-pink-300",
			],
		},
		"tone.primary.light.shadow": {
			class: [
				"shadow-pink-200/50",
			],
		},
		"tone.primary.light.shadow:hover": {
			class: [
				"hover:shadow-pink-300/60",
			],
		},
		"tone.primary.light.set": {
			token: [
				"tone.primary.light.text",
				"tone.primary.light.text:hover",
				"tone.primary.light.text",
				"tone.primary.light.bg",
				"tone.primary.light.bg:hover",
				"tone.primary.light.bg",
				"tone.primary.light.border",
				"tone.primary.light.border:hover",
				"tone.primary.light.border",
				"tone.primary.light.border:group-hover",
				"tone.primary.light.shadow",
				"tone.primary.light.shadow:hover",
				"tone.primary.light.shadow",
			],
		},
		//
		"tone.primary.dark.text": {
			class: [
				"text-pink-50",
			],
		},
		"tone.primary.dark.text:hover": {
			class: [
				"hover:text-pink-50/80",
			],
		},
		"tone.primary.dark.bg": {
			class: [
				"bg-pink-900/90",
			],
		},
		"tone.primary.dark.bg:hover": {
			class: [
				"hover:bg-pink-800/90",
			],
		},
		"tone.primary.dark.bg:even": {
			class: [
				"even:bg-pink-800/80",
			],
		},
		"tone.primary.dark.bg:odd": {
			class: [
				"odd:bg-pink-950/90",
			],
		},
		"tone.primary.dark.accent": {
			class: [
				"bg-pink-900/50",
			],
		},
		"tone.primary.dark.from": {
			class: [
				"from-pink-900/50",
			],
		},
		"tone.primary.dark.to": {
			class: [
				"to-pink-900/50",
			],
		},
		"tone.primary.dark.border": {
			class: [
				"border-pink-500/60",
				"border-b-pink-500/80",
			],
		},
		"tone.primary.dark.border:hover": {
			class: [
				"hover:border-pink-400/70",
				"hover:border-b-pink-400/90",
			],
		},
		"tone.primary.dark.border:group-hover": {
			class: [
				"group-hover:border-pink-400/70",
				"group-hover:border-b-pink-400/90",
			],
		},
		"tone.primary.dark.shadow": {
			class: [
				"shadow-pink-900/40",
			],
		},
		"tone.primary.dark.shadow:hover": {
			class: [
				"hover:shadow-pink-800/50",
			],
		},
		"tone.primary.dark.set": {
			token: [
				"tone.primary.dark.text",
				"tone.primary.dark.text:hover",
				"tone.primary.dark.text",
				"tone.primary.dark.bg",
				"tone.primary.dark.bg:hover",
				"tone.primary.dark.bg",
				"tone.primary.dark.border",
				"tone.primary.dark.border:hover",
				"tone.primary.dark.border",
				"tone.primary.dark.border:group-hover",
				"tone.primary.dark.shadow",
				"tone.primary.dark.shadow:hover",
				"tone.primary.dark.shadow",
			],
		},

		// Secondary tone - Purple-based palette (complementary to pink)
		"tone.secondary.light.text": {
			class: [
				"text-purple-700",
			],
		},
		"tone.secondary.light.text:hover": {
			class: [
				"hover:text-purple-800",
			],
		},
		"tone.secondary.light.bg": {
			class: [
				"bg-purple-100",
			],
		},
		"tone.secondary.light.bg:hover": {
			class: [
				"hover:bg-purple-200",
			],
		},
		"tone.secondary.light.bg:even": {
			class: [
				"even:bg-purple-100",
			],
		},
		"tone.secondary.light.bg:odd": {
			class: [
				"odd:bg-purple-50",
			],
		},
		"tone.secondary.light.accent": {
			class: [
				"bg-purple-100/50",
			],
		},
		"tone.secondary.light.from": {
			class: [
				"from-purple-100/50",
			],
		},
		"tone.secondary.light.to": {
			class: [
				"to-purple-100/50",
			],
		},
		"tone.secondary.light.border": {
			class: [
				"border-purple-200/60",
				"border-b-purple-200",
			],
		},
		"tone.secondary.light.border:hover": {
			class: [
				"hover:border-purple-300/60",
				"hover:border-b-purple-300",
			],
		},
		"tone.secondary.light.border:group-hover": {
			class: [
				"group-hover:border-purple-300/60",
				"group-hover:border-b-purple-300",
			],
		},
		"tone.secondary.light.shadow": {
			class: [
				"shadow-purple-200/50",
			],
		},
		"tone.secondary.light.shadow:hover": {
			class: [
				"hover:shadow-purple-300/60",
			],
		},
		"tone.secondary.light.set": {
			token: [
				"tone.secondary.light.text",
				"tone.secondary.light.text:hover",
				"tone.secondary.light.text",
				"tone.secondary.light.bg",
				"tone.secondary.light.bg:hover",
				"tone.secondary.light.bg",
				"tone.secondary.light.border",
				"tone.secondary.light.border:hover",
				"tone.secondary.light.border",
				"tone.secondary.light.border:group-hover",
				"tone.secondary.light.shadow",
				"tone.secondary.light.shadow:hover",
				"tone.secondary.light.shadow",
			],
		},
		//
		"tone.secondary.dark.text": {
			class: [
				"text-purple-100",
			],
		},
		"tone.secondary.dark.text:hover": {
			class: [
				"hover:text-purple-50",
			],
		},
		"tone.secondary.dark.bg": {
			class: [
				"bg-purple-900/90",
			],
		},
		"tone.secondary.dark.bg:hover": {
			class: [
				"hover:bg-purple-800/90",
			],
		},
		"tone.secondary.dark.bg:even": {
			class: [
				"even:bg-purple-800/80",
			],
		},
		"tone.secondary.dark.bg:odd": {
			class: [
				"odd:bg-purple-950/90",
			],
		},
		"tone.secondary.dark.accent": {
			class: [
				"bg-purple-900/50",
			],
		},
		"tone.secondary.dark.from": {
			class: [
				"from-purple-900/50",
			],
		},
		"tone.secondary.dark.to": {
			class: [
				"to-purple-900/50",
			],
		},
		"tone.secondary.dark.border": {
			class: [
				"border-purple-500/60",
				"border-b-purple-500/80",
			],
		},
		"tone.secondary.dark.border:hover": {
			class: [
				"hover:border-purple-400/70",
				"hover:border-b-purple-400/90",
			],
		},
		"tone.secondary.dark.border:group-hover": {
			class: [
				"group-hover:border-purple-400/70",
				"group-hover:border-b-purple-400/90",
			],
		},
		"tone.secondary.dark.shadow": {
			class: [
				"shadow-purple-900/40",
			],
		},
		"tone.secondary.dark.shadow:hover": {
			class: [
				"hover:shadow-purple-800/50",
			],
		},
		"tone.secondary.dark.set": {
			token: [
				"tone.secondary.dark.text",
				"tone.secondary.dark.text:hover",
				"tone.secondary.dark.text",
				"tone.secondary.dark.bg",
				"tone.secondary.dark.bg:hover",
				"tone.secondary.dark.bg",
				"tone.secondary.dark.border",
				"tone.secondary.dark.border:hover",
				"tone.secondary.dark.border",
				"tone.secondary.dark.border:group-hover",
				"tone.secondary.dark.shadow",
				"tone.secondary.dark.shadow:hover",
				"tone.secondary.dark.shadow",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type ThemeCls = typeof ThemeCls;
