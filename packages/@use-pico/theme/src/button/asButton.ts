import { tvc } from "@use-pico/cls";
import type { Type } from "../type/Type";

export namespace asButton {
	export type Tone = Type.Tone;
	export type Theme = Type.Theme;
	export type Size = Type.Size;
	export type Round = Type.Round;
	export type SnapTo = Type.SnapTo;
	export type Justify = "start" | "center";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		round?: Round;
		snapTo?: SnapTo;
		disabled?: boolean;
		background?: boolean;
		border?: boolean;
		justify?: Justify;
		shadow?: boolean;
		/**
		 * When true, button will be bumped by a z-index.
		 */
		zIndex?: boolean;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asButton = ({
	tone = "primary",
	theme = "light",
	size = "md",
	round = "default",
	snapTo,
	disabled,
	background = true,
	border = true,
	shadow = true,
	justify,
	zIndex,
	className,
}: asButton.Props) => {
	return {
		"data-ui": "Button",
		//
		"data-tone": tone,
		"data-theme": theme,
		"data-size": size,
		"data-round": round,
		"data-snap-to": snapTo,
		"data-disabled": disabled,
		"data-background": background,
		"data-border": border,
		"data-z-index": zIndex,
		"data-justify": justify,
		"data-shadow": shadow,
		//
		className: tvc("Button", className),
	} as const;
};
