import { tvc } from "@use-pico/cls";
import type { Type } from "../type/Type";

export namespace asIcon {
	export type Tone = Type.Tone;
	export type Theme = Type.Theme;
	export type Size = Type.Size;

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		disabled?: boolean;
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asIcon = ({ tone, theme, size, disabled, className }: asIcon.Props) => {
	return {
		"data-ui": "Icon",
		//
		"data-tone": tone,
		"data-theme": theme,
		"data-size": size,
		"data-disabled": disabled,
		//
		className: tvc("Icon", className),
	} as const;
};
