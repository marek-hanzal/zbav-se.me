/**
 * All available global UI attributes.
 */
export namespace Ui {
	/**
	 * Color tone/variant for UI components.
	 */
	export type Tone =
		| "brand"
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	/**
	 * Color theme preference.
	 */
	export type Theme = "light" | "dark";
	/**
	 * Size scale for components and spacing.
	 */
	export type Size = "default" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	/**
	 * Badge padding scale.
	 */
	export type Badge = Size;
	/**
	 * Text size scale.
	 */
	export type Text = Size;
	/**
	 * Square dimension size scale.
	 */
	export type Square = Size;
	/**
	 * Inner padding/spacing size scale.
	 */
	export type Inner = Size;
	/**
	 * Gap spacing size scale.
	 */
	export type Gap = Size;
	/**
	 * Border radius rounding scale.
	 */
	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";
	/**
	 * Layout flow direction.
	 */
	export type Flow = "vertical" | "horizontal";
	/**
	 * Cross-axis alignment for flex/grid items.
	 */
	export type Items =
		| "start"
		| "center"
		| "end"
		| "space-around"
		| "space-between"
		| "space-evenly"
		| "stretch";
	/**
	 * Main-axis justification for flex/grid containers.
	 */
	export type Justify =
		| "start"
		| "center"
		| "end"
		| "space-between"
		| "space-around"
		| "space-evenly";
	/**
	 * Positioning anchor point for overlays and popovers.
	 */
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "top"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center"
		| "bottom"
		| "left"
		| "left-center"
		| "right-center"
		| "right"
		| "middle";
	/**
	 * CSS position value.
	 */
	export type Position = "absolute" | "relative";
	/**
	 * Height sizing strategy.
	 */
	export type Height = "full" | "auto" | "content" | "viewport";
	/**
	 * Width sizing strategy.
	 */
	export type Width = "full" | "auto" | "content" | "viewport";
	/**
	 * Opacity level scale.
	 * Source of truth for allowed `data-ui-opacity` tokens. Keep CSS mapping in sync.
	 */
	export type Opacity =
		| "0"
		| "1"
		| "2"
		| "3"
		| "4"
		| "5"
		| "6"
		| "7"
		| "8"
		| "9"
		| "full"
		| "none";
	/**
	 * Font weight scale.
	 */
	export type Font = "light" | "normal" | "semibold" | "bold";
	/**
	 * CSS display value.
	 */
	export type Display = "block" | "inline" | "inline-block";
	/**
	 * Text/icon color variant.
	 */
	export type Color = "text" | "lead" | "icon";
	/**
	 * Background color variant.
	 */
	export type Background = "default" | "alt";
	/**
	 * Active state background color variant.
	 */
	export type BackgroundActive = Background;
	/**
	 * Whether to apply italic styling.
	 */
	export type Italic = boolean;
	/**
	 * Whether to apply border styling.
	 */
	export type Border = boolean;
	/**
	 * Whether to apply border styling in active state.
	 */
	export type BorderActive = Border;
	/**
	 * Whether to apply shadow styling.
	 */
	export type Shadow = boolean;
	/**
	 * Whether to apply shadow styling in active state.
	 */
	export type ShadowActive = Shadow;
	/**
	 * Whether to apply elevated z-index.
	 */
	export type zIndex = boolean;
	/**
	 * Whether the component is disabled.
	 */
	export type Disabled = boolean;
}
