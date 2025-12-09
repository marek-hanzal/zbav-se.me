export namespace Theme {
	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";
	export type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	export type Square = Size;
	export type Inner = Size;
	export type Gap = Size;
	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";
	export type Flow = "vertical" | "horizontal";
	export type Items =
		| "start"
		| "center"
		| "end"
		| "space-around"
		| "space-between"
		| "space-evenly";
	export type Justify =
		| "start"
		| "center"
		| "end"
		| "space-between"
		| "space-around"
		| "space-evenly";
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "top"
		| "bottom-left"
		| "bottom-right"
		| "bottom"
		| "left-center"
		| "right-center";
	export type Position = "absolute" | "relative";
	export type Height = "full" | "auto" | "content" | "viewport";
	export type Width = "full" | "auto" | "content" | "viewport";
	export type Opacity =
		| "xs"
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "subtle"
		| "medium"
		| "strong";

	/**
	 * All the values available in this theme.
	 */
	export interface Attrs {
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		round?: Round;
		justify?: Justify;
		items?: Items;
		opacity?: Opacity;
		square?: Square;
		inner?: Inner;
		snapTo?: SnapTo;
		gap?: Gap;
		flow?: Flow;
		position?: Position;
		height?: Height;
		width?: Width;
		background?: boolean;
		border?: boolean;
		disabled?: boolean;
		shadow?: boolean;
		zIndex?: boolean;
	}
}
