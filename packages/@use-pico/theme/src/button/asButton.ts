import { tvc } from "@use-pico/cls";
import type { Type } from "../type/Type";

export namespace asButton {
	export type Tone = Type.Tone;
	export type Theme = Type.Theme;
	export type Size = Type.Size;
	export type Round = Type.Round;
	export type SnapTo = Type.SnapTo;
	export type Square = Type.Square;
	export type Justify = "start" | "center";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		//
		background?: boolean;
		border?: boolean;
		disabled?: boolean;
		justify?: Justify;
		round?: Round;
		shadow?: boolean;
		size?: Size;
		snapTo?: SnapTo;
		square?: Square;
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
	square,
	round = "default",
	snapTo,
	disabled,
	background = true,
	border = true,
	shadow = true,
	justify,
	zIndex,
	//
	className,
}: asButton.Props) => {
	return {
		"data-ui": "Button",
		//
		"data-tone": tone,
		"data-theme": theme,
		//
		"data-background": background,
		"data-border": border,
		"data-disabled": disabled,
		"data-justify": justify,
		"data-round": round,
		"data-shadow": shadow,
		"data-size": size,
		"data-snap-to": snapTo,
		"data-square": square,
		"data-z-index": zIndex,
		//
		className: tvc("Button", className),
	} as const;
};
