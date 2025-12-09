import { tvc } from "@use-pico/cls";

type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Tail extends Uncapitalize<Tail>
		? `${Lowercase<Head>}${KebabCase<Tail>}`
		: `${Lowercase<Head>}-${KebabCase<Uncapitalize<Tail>>}`
	: S;

type Attrs<T extends keyof attr.Attributes> = {
	[K in T as `data-${KebabCase<K & string>}`]?: attr.Attributes[K];
};

/**
 * Converts a camelCase key to a kebab-case data attribute key.
 * @param key - The camelCase key to convert
 * @returns The kebab-case data attribute key (e.g., "tone" -> "data-tone", "snapTo" -> "data-snap-to")
 */
const toKey = (key: string) => {
	return `data-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
};

export namespace attr {
	export type Rest = object;

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
		//
		| "subtle"
		| "medium"
		| "strong";

	/**
	 * All attributes available for styling that a user can choose from.
	 * These attributes are used to style components through data attributes.
	 */
	export interface Attributes {
		/**
		 * Color/semantic tone of the component.
		 * Examples: primary, secondary, danger, warning, neutral, subtle, link.
		 */
		tone?: Tone;
		/**
		 * Theme variant for the component.
		 * Can be either "light" or "dark".
		 */
		theme?: Theme;
		//
		/**
		 * Size of the component.
		 * Available sizes: default, xs, sm, md, lg, xl, 2xl, 3xl, 4xl.
		 */
		size?: Size;
		/**
		 * Border radius/roundness of the component.
		 * Available options: default, sm, md, lg, xl, full.
		 */
		round?: Round;
		/**
		 * Justify content alignment for flexbox layouts.
		 * Controls how items are distributed along the main axis.
		 */
		justify?: Justify;
		/**
		 * Align items alignment for flexbox layouts.
		 * Controls how items are aligned along the cross axis.
		 */
		items?: Items;
		/**
		 * Opacity of the component.
		 * Available options: xs, sm, md, lg, xl, 2xl, 3xl, 4xl.
		 */
		opacity?: Opacity;
		/**
		 * Square dimensions where width equals height.
		 * Uses the same size scale as the size property.
		 */
		square?: Square;
		/**
		 * Inner spacing/padding size.
		 * Controls the internal spacing within the component.
		 */
		inner?: Inner;
		/**
		 * Position snapping for elements like tooltips or popovers.
		 * Defines where the element should be positioned relative to its anchor.
		 */
		snapTo?: SnapTo;
		/**
		 * Gap between items in flexbox or grid layouts.
		 * Uses the same size scale as the size property.
		 */
		gap?: Gap;
		/**
		 * Flex direction for flexbox layouts.
		 * Can be "vertical" or "horizontal".
		 */
		flow?: Flow;
		/**
		 * CSS position property.
		 * Can be "absolute" or "relative".
		 */
		position?: Position;
		/**
		 * Height value for the component.
		 * Available options: full, auto, content, viewport.
		 */
		height?: Height;
		/**
		 * Width value for the component.
		 * Available options: full, auto, content, viewport.
		 */
		width?: Width;
		//
		/**
		 * Whether to show background on the component.
		 */
		background?: boolean;
		/**
		 * Whether to show border on the component.
		 */
		border?: boolean;
		/**
		 * Whether the component is disabled.
		 * Typically affects interactivity and visual appearance.
		 */
		disabled?: boolean;
		/**
		 * Whether to show shadow on the component.
		 */
		shadow?: boolean;
		/**
		 * Whether to apply z-index to the component.
		 * Used for controlling stacking order.
		 */
		zIndex?: boolean;
	}

	export type DataAttributes = Attrs<keyof Attributes>;

	/**
	 * Output type from attr() function.
	 * Includes:
	 * - "data-ui"
	 * - data-xxx attributes for TPick
	 * - all original TProps excluding TPick and className
	 */
	export type Result = Record<string, unknown> &
		DataAttributes & {
			"data-ui": string;
			className?: string;
		};

	/**
	 * Public type for components – what you expose on <Badge>, <Button>, etc.
	 * Component users see:
	 * - all DOM props from TProps (excluding className)
	 * - plus subset of Attributes (TPick)
	 */
	export type Component<TAttrs extends Attributes, TRest extends Rest> = Omit<
		TRest,
		"className"
	> &
		Partial<TAttrs> & {
			className?: tvc.ClassName;
		};

	/**
	 * Input type for attr() function.
	 * Includes:
	 * - ui, attrs, className
	 * - any TProps (DOM properties)
	 * - plus subset of Attributes determined by TPick
	 */
	export type Props<TAttrs extends Attributes> = Partial<TAttrs> & {
		ui: string;
		attrs: readonly (keyof TAttrs)[];
		className?: tvc.ClassName;
	} & Record<string, unknown>;
}

/**
 * Transforms component props into data attributes for styling.
 * Separates styling attributes (specified in attrs) from regular DOM props,
 * converts styling attributes to data-* attributes, and merges className using tvc.
 *
 * @param props - Component props including ui, attrs, className, and other props
 * @param props.ui - The UI component identifier
 * @param props.attrs - Array of attribute keys to convert to data attributes
 * @param props.className - Optional className to merge with ui
 * @returns Object with data-ui, data-* attributes, remaining props, and merged className
 */
export const attr = <TAttrs extends attr.Attributes>({
	ui,
	attrs,
	className,
	...rest
}: attr.Props<TAttrs>): attr.Result => {
	const data: [
		string,
		unknown,
	][] = [];
	const props: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(rest)) {
		if (attrs.includes(key as keyof attr.Attributes)) {
			data.push([
				toKey(key),
				value,
			]);
			continue;
		}

		props[key] = value;
	}

	return {
		"data-ui": ui,
		// data-xxx attributes for TPick
		...(Object.fromEntries(data) as attr.DataAttributes),
		// remaining original props excluding TPick and className
		...props,
		// className merged via tvc(ui, className)
		className: tvc(ui, className),
	} as attr.Result;
};
