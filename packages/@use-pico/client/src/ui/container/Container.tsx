import type { ComponentProps, FC } from "react";
import type { UiProps } from "../../type/UiProps";

export namespace Container {
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

	export interface Props extends UiProps<Omit<ComponentProps<"div">, "onChange">> {
		/**
		 * Visual tone of the container.
		 *
		 * @default undefined
		 */
		tone?: Tone;

		/**
		 * Theme variant for light/dark mode.
		 *
		 * @default undefined
		 */
		theme?: Theme;

		/**
		 * Height behavior of the container.
		 *
		 * - `"full"` - Fits parent container (h-full with min-h-0 and max-h-full)
		 * - `"auto"` - Adjusts to content (h-auto with min-h-0 and w-full)
		 * - `"viewport"` - Uses dynamic viewport height (h-dvh with min-h-dvh and w-full)
		 *
		 * @default undefined
		 */
		height?: Height;

		/**
		 * Width behavior of the container.
		 *
		 * - `"full"` - Fits parent container (w-full with min-w-0 and max-w-full)
		 * - `"auto"` - Adjusts to content (w-auto with min-w-0 and h-full)
		 * - `"viewport"` - Uses dynamic viewport width (w-dvw with min-w-dvw)
		 *
		 * @default undefined
		 */
		width?: Width;

		/**
		 * Layout behavior and grid configuration.
		 *
		 * - `"horizontal"` - Horizontal grid with auto-sized columns
		 * - `"horizontal-full"` - Horizontal grid where each child takes 100% width (snap-scroll friendly)
		 * - `"vertical"` - Vertical grid with auto-sized rows
		 * - `"vertical-full"` - Vertical grid where each child takes 100% height (snap-scroll friendly)
		 * - `"vertical-header-content-footer"` - Three-row grid: header (min-content), flexible content (1fr), footer (min-content)
		 * - `"vertical-header-content"` - Two-row grid: header (min-content), flexible content (1fr)
		 * - `"vertical-content-footer"` - Two-row grid: flexible content (1fr), footer (min-content)
		 * - `"vertical-centered"` - Single-row grid that centers content vertically (useful for centering content in available space)
		 * - `"horizontal-flex"` - Horizontal flexbox layout (flex-row)
		 * - `"vertical-flex"` - Vertical flexbox layout (flex-col)
		 *
		 * @default undefined
		 */
		layout?: Layout;

		/**
		 * Scroll behavior for scrolling.
		 *
		 * - `"horizontal"` - Horizontal scrolling with stable scrollbar gutter
		 * - `"vertical"` - Vertical scrolling with stable scrollbar gutter
		 * - `"hidden"` - Hide overflow content
		 *
		 * **Note:** When using `snap`, scrolling is automatically enabled and you don't need to specify `scroll` separately.
		 *
		 * @default undefined
		 */
		scroll?: Scroll;

		/**
		 * Scroll snap behavior for smooth scrolling.
		 *
		 * Automatically enables scrolling in the appropriate direction (horizontal or vertical).
		 * You don't need to specify `scroll` when using `snap` - it's included automatically.
		 *
		 * @default undefined
		 */
		snap?: {
			snap: Snap;
			align: SnapAlign;
		};

		/**
		 * Square padding using design tokens.
		 *
		 * @default undefined
		 */
		square?: Square;

		/**
		 * Gap spacing between grid items or flex items.
		 *
		 * - `"xs"` - gap-1 (0.25rem)
		 * - `"sm"` - gap-2 (0.5rem)
		 * - `"md"` - gap-3 (0.75rem)
		 * - `"lg"` - gap-4 (1rem)
		 * - `"xl"` - gap-5 (1.25rem)
		 *
		 * @default undefined
		 */
		gap?: Gap;

		/**
		 * CSS position behavior.
		 *
		 * - `"absolute"` - Absolutely positioned
		 * - `"relative"` - Relatively positioned
		 *
		 * @default "unset"
		 */
		position?: Position;

		/**
		 * Absolute positioning helper for snapping the container to parent edges.
		 * Requires the parent element to have relative positioning.
		 *
		 * - `"top-left"` - Snaps to top-left corner
		 * - `"top-center"` - Snaps to top-center edge
		 * - `"top-right"` - Snaps to top-right corner
		 * - `"left-center"` - Snaps to center-left edge
		 * - `"right-center"` - Snaps to center-right edge
		 * - `"bottom-left"` - Snaps to bottom-left corner
		 * - `"bottom-right"` - Snaps to bottom-right corner
		 * - `"bottom"` - Snaps to full-width bottom edge
		 *
		 * @default undefined
		 */
		snapTo?: SnapTo;

		/**
		 * Disabled state of the container.
		 *
		 * @default undefined
		 */
		disabled?: boolean;
	}
}

export const Container: FC<Container.Props> = ({
	ref,
	ui,
	//
	tone,
	theme,
	height,
	width,
	layout,
	scroll,
	snap,
	square,
	gap,
	position,
	snapTo,
	disabled,
	//
	...props
}) => {
	return (
		<div
			ref={ref}
			data-root={"Container"}
			data-ui={ui ?? "Container"}
			//
			data-tone={tone}
			data-theme={theme}
			//
			data-disabled={disabled}
			//
			data-layout={layout}
			//
			data-height={height}
			data-width={width}
			//
			data-position={position}
			//
			data-scroll={scroll}
			//
			data-snap={snap?.snap}
			data-snap-align={snap?.align}
			//
			data-square={square}
			data-gap={gap}
			//
			data-snap-to={snapTo}
			//
			{...props}
		/>
	);
};
