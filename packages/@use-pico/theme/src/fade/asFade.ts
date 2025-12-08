import { tvc } from "@use-pico/cls";
import type { Type } from "../type/Type";

export namespace asFade {
	export type Tone = Type.Tone;
	export type Theme = Type.Theme;

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
