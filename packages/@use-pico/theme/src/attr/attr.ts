import { tvc } from "@use-pico/cls";

type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Tail extends Uncapitalize<Tail>
		? `${Lowercase<Head>}${KebabCase<Tail>}`
		: `${Lowercase<Head>}-${KebabCase<Uncapitalize<Tail>>}`
	: S;

type Attrs<T extends keyof attr.Attributes> = {
	[K in T as `data-${KebabCase<K & string>}`]?: attr.Attributes[K];
};

const toKey = (key: string) => {
	return `data-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
};

export namespace attr {
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

	/**
	 * Internal props type used for calling the attr method.
	 *
	 * @internal
	 * @template TPick - The keys from Attributes to include in the props
	 * @returns A type that combines selected attributes with required "ui" string
	 *          and optional "className" for the attr method
	 */
	export type Props<TPick extends keyof Attributes> = Pick<Attributes, TPick> & {
		/**
		 * Used to mark piece of UI in DOM, so it's easy to find the proper component by its name.
		 */
		ui: string;
		attrs: TPick[];
		/**
		 * More clever way to pass individual classnames (going through tailwind merge).
		 */
		className?: tvc.ClassName;
	};

	/**
	 * Component type is used to define individual components (e.g. button, badge, whatever)
	 * which will use props from default set (if needed); it ensures it has proper "api"
	 * (e.g. exported data-ui attribute, handled classNames,...)
	 *
	 * @template TPick - The keys from Attributes to include in the component's props
	 * @template TProps - The component's own props type (defaults to unknown)
	 * @returns A type that combines the component's props with selected attributes,
	 *          excluding "className" from TProps and "ui" from Props<TPick>
	 */
	export type Component<TPick extends keyof Attributes, TProps = unknown> = Omit<
		TProps,
		"className"
	> &
		Omit<Props<TPick>, "ui" | "attrs">;
}

/**
 * Used to access all the available styling options for any element supporting data-xxx attributes.
 * Converts attribute props to data attributes and combines them with the ui identifier and className.
 *
 * @template TPick - The keys from Attributes to include in the props
 * @param props - Props containing ui, className, and selected attributes
 * @returns An object with data-ui attribute, converted data-xxx attributes, and merged className
 */
export const attr = <TPick extends keyof attr.Attributes>({
	ui,
	attrs,
	className,
	...props
}: attr.Props<TPick>) => {
	return {
		"data-ui": ui,
		//
		...(Object.fromEntries(
			Object.entries(props).map(([key, value]) => [
				toKey(key),
				value,
			]),
		) as Attrs<TPick>),
		//
		className: tvc(ui, className),
	} as const;
};
