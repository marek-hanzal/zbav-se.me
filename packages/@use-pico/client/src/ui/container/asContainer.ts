import { tvc } from "@use-pico/cls";

export namespace asContainer {
	export type Tone = "primary";
	export type Theme = "light" | "dark";
	export type Layout =
		//
		| "vertical"
		| "vertical-full"
		| "vertical-header-content-footer"
		| "vertical-header-content"
		| "vertical-content-footer"
		| "vertical-centered"
		| "vertical-flex"
		//
		| "horizontal"
		| "horizontal-full"
		| "horizontal-flex";
	export type Height = "full" | "auto" | "content" | "viewport";
	export type Width = "full" | "auto" | "viewport";
	export type Position = "absolute" | "relative";
	export type Scroll = "vertical" | "horizontal" | "hidden";
	export type Snap = "vertical" | "horizontal";
	export type SnapAlign = "start" | "center" | "end";
	export type Square = "xs" | "sm" | "md" | "lg" | "xl";
	export type Gap = "xs" | "sm" | "md" | "lg" | "xl";
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "left-center"
		| "right-center"
		| "bottom-left"
		| "bottom-right"
		| "bottom";

	export interface Props {
		tone?: Tone;
		theme?: Theme;
		layout?: Layout;
		height?: Height;
		width?: Width;
		position?: Position;
		scroll?: Scroll;
		snap?: Snap;
		snapAlign?: SnapAlign;
		square?: Square;
		snapTo?: SnapTo;
		gap?: Gap;
		disabled?: boolean;
		//
		className?: tvc.ClassName;
	}

	export type PropsEx<TProps = unknown> = Omit<TProps, "className"> & Props;
}

export const asContainer = ({
	tone,
	theme,
	layout,
	height,
	width,
	position,
	scroll,
	snap,
	snapAlign,
	square,
	gap,
	snapTo,
	disabled,
	//
	className,
}: asContainer.Props) => {
	return {
		"data-ui": "Container",
		//
		"data-tone": tone,
		"data-theme": theme,
		//
		"data-layout": layout,
		"data-height": height,
		"data-width": width,
		//
		"data-square": square,
		"data-gap": gap,
		//
		"data-snap-to": snapTo,
		//
		"data-position": position,
		"data-scroll": scroll,
		//
		"data-snap": snap,
		"data-snap-align": snapAlign,
		//
		"data-disabled": disabled,
		//
		className: tvc("Container", className),
	} as const;
};
