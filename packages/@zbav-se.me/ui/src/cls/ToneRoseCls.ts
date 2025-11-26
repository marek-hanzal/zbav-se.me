import { PicoCls } from "@use-pico/client/cls";
import { contract } from "@use-pico/cls";

/**
 * Tone system:
 * - primary   = rose / fuchsia (main brand accent)
 * - secondary = violet (supporting accent, close to primary)
 *
 * light  = base surfaces, cards, soft states
 * dark   = stronger accent of the same tone (CTAs, highlighted / destructive)
 */
export const ToneRoseCls = contract(PicoCls.contract)
	.def()
	.token({
		// ----------------------------------------------------
		// PRIMARY TONE (rose / fuchsia)
		// ----------------------------------------------------

		// Light: default cards / soft primary surfaces
		"tone.primary.light.text": {
			// Tone-aligned text, not neutral grey
			class: [
				"text-rose-900",
			],
		},
		"tone.primary.light.text:hover": {
			class: [
				"hover:text-rose-950",
			],
		},
		"tone.primary.light.bg": {
			class: [
				"bg-rose-50/80",
			],
		},
		"tone.primary.light.bg:hover": {
			class: [
				"hover:bg-rose-100",
			],
		},
		"tone.primary.light.bg:even": {
			class: [
				"even:bg-rose-50/80",
			],
		},
		"tone.primary.light.bg:odd": {
			class: [
				"odd:bg-white",
			],
		},
		"tone.primary.light.accent": {
			class: [
				"bg-rose-100/70",
			],
		},
		"tone.primary.light.from": {
			class: [
				"from-rose-50/80",
			],
		},
		"tone.primary.light.to": {
			class: [
				"to-rose-100/80",
			],
		},
		"tone.primary.light.border": {
			class: [
				"border-rose-200/80",
			],
		},
		"tone.primary.light.border:hover": {
			class: [
				"hover:border-rose-300",
			],
		},
		"tone.primary.light.border:group-hover": {
			class: [
				"group-hover:border-rose-300",
			],
		},
		"tone.primary.light.shadow": {
			class: [
				"shadow-rose-100/70",
			],
		},
		"tone.primary.light.shadow:hover": {
			class: [
				"hover:shadow-rose-200/80",
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

		// Dark: strong primary accent (hlavní CTA, ale ne úplná tma)
		// PRIMARY DARK – jen lehce přitvrzený light, ne beton
		"tone.primary.dark.text": {
			class: [
				"text-rose-50",
			],
		},
		"tone.primary.dark.text:hover": {
			class: [
				"hover:text-rose-100",
			],
		},
		"tone.primary.dark.bg": {
			// místo fuchsia-500 -> světlejší, víc navázané na light
			class: [
				"bg-rose-400/95",
			],
		},
		"tone.primary.dark.bg:hover": {
			class: [
				"hover:bg-rose-300/95",
			],
		},
		"tone.primary.dark.bg:even": {
			class: [
				"even:bg-rose-400/95",
			],
		},
		"tone.primary.dark.bg:odd": {
			class: [
				"odd:bg-rose-500/95",
			],
		},
		"tone.primary.dark.accent": {
			class: [
				"bg-rose-300/80",
			],
		},
		"tone.primary.dark.from": {
			class: [
				"from-rose-300/90",
			],
		},
		"tone.primary.dark.to": {
			class: [
				"to-rose-400/95",
			],
		},
		"tone.primary.dark.border": {
			class: [
				// jemnější hrana, žádný neon
				"border-rose-300/80",
			],
		},
		"tone.primary.dark.border:hover": {
			class: [
				"hover:border-rose-200/80",
			],
		},
		"tone.primary.dark.border:group-hover": {
			class: [
				"group-hover:border-rose-200/80",
			],
		},
		"tone.primary.dark.shadow": {
			// jen měkký glow, ne hluboký stín
			class: [
				"shadow-rose-300/50",
			],
		},
		"tone.primary.dark.shadow:hover": {
			class: [
				"hover:shadow-rose-400/60",
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

		// ----------------------------------------------------
		// SECONDARY TONE (violet – blízko primary)
		// ----------------------------------------------------

		// Light: secondary surfaces, měkké akcenty
		"tone.secondary.light.text": {
			class: [
				"text-violet-900",
			],
		},
		"tone.secondary.light.text:hover": {
			class: [
				"hover:text-violet-950",
			],
		},
		"tone.secondary.light.bg": {
			class: [
				"bg-violet-50/80",
			],
		},
		"tone.secondary.light.bg:hover": {
			class: [
				"hover:bg-violet-100",
			],
		},
		"tone.secondary.light.bg:even": {
			class: [
				"even:bg-violet-50/80",
			],
		},
		"tone.secondary.light.bg:odd": {
			class: [
				"odd:bg-white",
			],
		},
		"tone.secondary.light.accent": {
			class: [
				"bg-violet-100/70",
			],
		},
		"tone.secondary.light.from": {
			class: [
				"from-violet-50/80",
			],
		},
		"tone.secondary.light.to": {
			class: [
				"to-violet-100/80",
			],
		},
		"tone.secondary.light.border": {
			class: [
				"border-violet-200/80",
			],
		},
		"tone.secondary.light.border:hover": {
			class: [
				"hover:border-violet-300",
			],
		},
		"tone.secondary.light.border:group-hover": {
			class: [
				"group-hover:border-violet-300",
			],
		},
		"tone.secondary.light.shadow": {
			class: [
				"shadow-violet-100/70",
			],
		},
		"tone.secondary.light.shadow:hover": {
			class: [
				"hover:shadow-violet-200/80",
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

		// Dark: strong secondary accent (alt CTA / “už je aktivní” / destruktivní)
		"tone.secondary.dark.text": {
			class: [
				"text-violet-50",
			],
		},
		"tone.secondary.dark.text:hover": {
			class: [
				"hover:text-violet-100",
			],
		},
		"tone.secondary.dark.bg": {
			// Odlehčené z 700/800
			class: [
				"bg-violet-600",
			],
		},
		"tone.secondary.dark.bg:hover": {
			class: [
				"hover:bg-violet-500",
			],
		},
		"tone.secondary.dark.bg:even": {
			class: [
				"even:bg-violet-600",
			],
		},
		"tone.secondary.dark.bg:odd": {
			class: [
				"odd:bg-violet-700",
			],
		},
		"tone.secondary.dark.accent": {
			class: [
				"bg-violet-600/80",
			],
		},
		"tone.secondary.dark.from": {
			class: [
				"from-violet-600",
			],
		},
		"tone.secondary.dark.to": {
			class: [
				"to-violet-500",
			],
		},
		"tone.secondary.dark.border": {
			class: [
				"border-violet-300",
			],
		},
		"tone.secondary.dark.border:hover": {
			class: [
				"hover:border-violet-200",
			],
		},
		"tone.secondary.dark.border:group-hover": {
			class: [
				"group-hover:border-violet-200",
			],
		},
		"tone.secondary.dark.shadow": {
			class: [
				"shadow-black/50",
			],
		},
		"tone.secondary.dark.shadow:hover": {
			class: [
				"hover:shadow-black/60",
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
		"border.default": {
			class: [
				"border-none",
			],
		},
		"shadow.default": {
			class: [
				"shadow-none",
			],
		},
		"round.default": {
			class: [
				"rounded-lg",
			],
		},
	})
	.defaults({
		tone: "primary",
		theme: "light",
	})
	.cls();

export type ToneRoseCls = typeof ToneRoseCls;
