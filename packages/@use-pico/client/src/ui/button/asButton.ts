import { tvc } from "@use-pico/cls";

export namespace asButton {
	export type Tone =
		| "primary"
		| "secondary"
		| "warning"
		| "danger"
		| "link"
		| "neutral"
		| "subtle";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl";
	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "bottom"
		| "left-center"
		| "right-center";
	export type Justify = "start" | "center";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		round?: Round;
		snapTo?: SnapTo;
		disabled?: boolean;
		background?: boolean;
		justify?: Justify;
		className?: string[];
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asButton = ({
	tone,
	theme,
	size,
	round,
	snapTo,
	disabled,
	background,
	justify,
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
		"data-justify": justify,
		//
		className: tvc("Button", className),
	} as const;
};
