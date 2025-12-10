/**
 * All available global UI attributes.
 */
export namespace Ui {
	export type Tone =
		| "brand"
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";
	export type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	export type Text = Size;
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
	export type Font = "light" | "normal" | "semibold" | "bold";
	export type Display = "block" | "inline";
	export type Color = "text" | "lead" | "icon";
	export type Background = "default" | "alt";
	export type Italic = boolean;
	export type Border = boolean;
	export type Shadow = boolean;
	export type zIndex = boolean;
	export type Disabled = boolean;
}
