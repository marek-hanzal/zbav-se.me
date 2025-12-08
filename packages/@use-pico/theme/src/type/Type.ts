export namespace Type {
	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";

	export type Theme = "light" | "dark";

	export type Flow = "vertical" | "horizontal";

	export type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";

	export type Square = Size;

	export type Inner = Size;

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
}
