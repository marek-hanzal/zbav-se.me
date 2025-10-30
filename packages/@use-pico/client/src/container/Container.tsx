import { type Cls, useCls } from "@use-pico/cls";
import type { ComponentProps, FC, PropsWithChildren, Ref } from "react";
import type { UiProps } from "../component/UiProps";
import { ContainerCls } from "./ContainerCls";

export namespace Container {
	export interface Props
		extends UiProps<ContainerCls.Props<PropsWithChildren>> {
		ref?: Ref<HTMLDivElement>;

		/**
		 * Visual tone of the container.
		 *
		 * @default "unset"
		 */
		tone?: Cls.VariantOf<ContainerCls, "tone">;

		/**
		 * Theme variant for light/dark mode.
		 *
		 * @default "unset"
		 */
		theme?: Cls.VariantOf<ContainerCls, "theme">;

		/**
		 * Height behavior of the container.
		 *
		 * - `"unset"` - Default div behavior (no classes applied)
		 * - `"full"` - Takes full height with min-h-0 and max-h-full
		 * - `"dvh"` - Uses dynamic viewport height (dvh) with min-h-dvh and w-full
		 * - `"auto"` - Auto height with min-h-0 and w-full
		 *
		 * @default "full"
		 */
		height?: Cls.VariantOf<ContainerCls, "height">;

		/**
		 * Width behavior of the container.
		 *
		 * - `"unset"` - Default div behavior (no classes applied)
		 * - `"full"` - Takes full width with min-w-0 and max-w-full
		 * - `"dvw"` - Uses dynamic viewport width (dvw) with min-w-dvw
		 * - `"auto"` - Auto width with min-w-0 and h-full
		 *
		 * @default "full"
		 */
		width?: Cls.VariantOf<ContainerCls, "width">;

		/**
		 * Layout behavior and grid configuration.
		 *
		 * - `"unset"` - No grid layout applied
		 * - `"vertical"` - Vertical grid with auto-sized rows
		 * - `"vertical-header-content-footer"` - Three-row grid: header (min-content), flexible content (1fr), footer (min-content)
		 * - `"vertical-header-content"` - Two-row grid: header (min-content), flexible content (1fr)
		 * - `"vertical-content-footer"` - Two-row grid: flexible content (1fr), footer (min-content)
		 * - `"vertical-full"` - Vertical grid where each child takes 100% height (snap-scroll friendly)
		 * - `"vertical-centered"` - Single-row grid that centers content vertically (useful for centering content in available space)
		 * - `"horizontal"` - Horizontal grid with auto-sized columns
		 * - `"horizontal-full"` - Horizontal grid where each child takes 100% width (snap-scroll friendly)
		 *
		 * @default "unset"
		 */
		layout?: Cls.VariantOf<ContainerCls, "layout">;

		/**
		 * Scroll behavior for scrolling.
		 *
		 * - `"unset"` - No scroll handling
		 * - `"horizontal"` - Horizontal scrolling with stable scrollbar gutter
		 * - `"vertical"` - Vertical scrolling with stable scrollbar gutter
		 * - `"hidden"` - Hide overflow content
		 *
		 * **Note:** When using `snap`, scrolling is automatically enabled and you don't need to specify `scroll` separately.
		 *
		 * @default "unset"
		 */
		scroll?: Cls.VariantOf<ContainerCls, "scroll">;

		/**
		 * Scroll snap behavior for smooth scrolling.
		 *
		 * Automatically enables scrolling in the appropriate direction (horizontal or vertical).
		 * You don't need to specify `scroll` when using `snap` - it's included automatically.
		 *
		 * - `"unset"` - No scroll snap
		 * - `"horizontal-start"` - Snap to start horizontally (includes horizontal scrolling)
		 * - `"horizontal-center"` - Snap to center horizontally (includes horizontal scrolling)
		 * - `"horizontal-end"` - Snap to end horizontally (includes horizontal scrolling)
		 * - `"vertical-start"` - Snap to start vertically (includes vertical scrolling)
		 * - `"vertical-center"` - Snap to center vertically (includes vertical scrolling)
		 * - `"vertical-end"` - Snap to end vertically (includes vertical scrolling)
		 *
		 * @default "unset"
		 */
		snap?: Cls.VariantOf<ContainerCls, "snap">;

		/**
		 * Touch panning lock behavior for mobile interactions.
		 *
		 * - `"unset"` - No touch panning restrictions
		 * - `"horizontal"` - Locks horizontal panning, allows vertical panning/scrolling
		 * - `"vertical"` - Locks vertical panning, allows horizontal panning/scrolling
		 *
		 * @default "unset"
		 */
		lock?: Cls.VariantOf<ContainerCls, "lock">;

		/**
		 * Square padding using design tokens.
		 *
		 * @default "unset"
		 */
		square?: Cls.VariantOf<ContainerCls, "square">;

		/**
		 * Gap spacing between grid items.
		 *
		 * - `"unset"` - No gap applied
		 * - `"xs"` - gap-1 (0.25rem)
		 * - `"sm"` - gap-2 (0.5rem)
		 * - `"md"` - gap-3 (0.75rem)
		 * - `"lg"` - gap-4 (1rem)
		 * - `"xl"` - gap-5 (1.25rem)
		 *
		 * @default "unset"
		 */
		gap?: Cls.VariantOf<ContainerCls, "gap">;

		/**
		 * Item placement within the grid container (place-items).
		 *
		 * - `"unset"` - No placement applied (default grid behavior)
		 * - `"start"` - Items aligned to start (place-items-start)
		 * - `"center"` - Items centered within their grid cells (place-items-center)
		 * - `"end"` - Items aligned to end (place-items-end)
		 * - `"stretch"` - Items stretched to fill their grid cells (place-items-stretch)
		 *
		 * @default "unset"
		 */
		items?: Cls.VariantOf<ContainerCls, "items">;

		/**
		 * CSS position behavior.
		 *
		 * - `"unset"` - No position applied
		 * - `"absolute"` - Absolutely positioned
		 * - `"relative"` - Relatively positioned
		 *
		 * @default "unset"
		 */
		position?: Cls.VariantOf<ContainerCls, "position">;

		/**
		 * Border styling using design tokens.
		 *
		 * @default "unset"
		 */
		border?: Cls.VariantOf<ContainerCls, "border">;

		/**
		 * Border radius using design tokens.
		 *
		 * @default "unset"
		 */
		round?: Cls.VariantOf<ContainerCls, "round">;

		/**
		 * Box shadow using design tokens.
		 *
		 * @default "unset"
		 */
		shadow?: Cls.VariantOf<ContainerCls, "shadow">;

		/**
		 * Props passed to the underlying div element.
		 *
		 * Extracted so they won't pollute the container's props.
		 */
		divProps?: Omit<ComponentProps<"div">, "children" | "className">;
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
	lock,
	square,
	gap,
	items,
	position,
	border,
	round,
	shadow,
	//
	cls = ContainerCls,
	tweak,
	//
	children,
	divProps,
}) => {
	const { slots } = useCls(cls, tweak, {
		variant: {
			height,
			width,
			layout,
			scroll,
			snap,
			lock,
			square,
			gap,
			items,
			position,
			border,
			round,
			shadow,
			tone,
			theme,
		},
	});

	return (
		<div
			ref={ref}
			data-ui={ui ?? "Container-root"}
			className={slots.root()}
			{...divProps}
		>
			{children}
		</div>
	);
};
