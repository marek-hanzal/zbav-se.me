import { tvc } from "@use-pico/cls";

export namespace asFade {
	export type Tone = "primary" | "secondary";
	export type Theme = "light" | "dark";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asFade = ({ tone, theme, className }: asFade.PropsEx) => {
	return {
		"data-ui": "Fade",
		//
		"data-tone": tone,
		"data-theme": theme,
		//
		className: tvc("Fade", className),
	} as const;
};
