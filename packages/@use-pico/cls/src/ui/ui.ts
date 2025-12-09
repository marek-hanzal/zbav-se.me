import { tvc } from "../utils/tvc";

/**
 * @internal
 */
type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Tail extends Uncapitalize<Tail>
		? `${Lowercase<Head>}${KebabCase<Tail>}`
		: `${Lowercase<Head>}-${KebabCase<Uncapitalize<Tail>>}`
	: S;

export namespace ui {
	export type Rest = object;

	/**
	 * @internal
	 */
	export type Data<TProps, T extends keyof TProps> = {
		[K in T as `data-ui-${KebabCase<K & string>}`]?: TProps[K];
	};

	export type Result<TProps> = Record<string, unknown> &
		Data<TProps, keyof TProps> & {
			"data-ui": string;
			className?: string;
		};

	/**
	 * User-land type used to create props for element supporting data-xxx attributes
	 */
	export type Component<TProps, TRest extends Rest> = TRest & Partial<Data<TProps, keyof TProps>>;

	/**
	 * Internal props used for "ui" method; this should not be used outside
	 *
	 * @internal
	 *
	 * @template TProps - The type of props that can be converted to data attributes
	 */
	export type Props<TProps> = Partial<TProps> & {
		/**
		 * Base component identifier, becomes the `data-ui` attribute value
		 */
		ui: string;
		/**
		 * Array of prop keys from `TProps` that should be converted to `data-ui-*` attributes
		 */
		attrs: readonly (keyof TProps)[];
		/**
		 * Optional additional CSS classes to merge with the base `ui` class
		 */
		className?: tvc.ClassName;
	} & Record<string, unknown>;
}

/**
 * Creates a contract between UI component variants and CSS by converting component props
 * to data attributes that can be targeted in stylesheets.
 *
 * This function transforms component props into `data-ui-*` attributes, establishing
 * a type-safe bridge between TypeScript component props and CSS selectors. Props listed
 * in the `attrs` array are converted from camelCase to kebab-case and prefixed with
 * `data-ui-`, allowing CSS to style components based on their variant props.
 *
 * @example
 * ```ts
 * // Component usage
 * const buttonProps = ui({
 *   ui: "Button",
 *   attrs: ["tone", "size", "theme"],
 *   tone: "primary",
 *   size: "large",
 *   theme: "dark",
 *   onClick: handleClick, // This prop is NOT in attrs, so it's passed through
 * });
 *
 * // Result:
 * // {
 * //   "data-ui": "Button",
 * //   "data-ui-tone": "primary",
 * //   "data-ui-size": "large",
 * //   "data-ui-theme": "dark",
 * //   onClick: handleClick,
 * //   className: "Button ..."
 * // }
 *
 * // CSS usage
 * // [data-ui="Button"][data-ui-tone="primary"] { ... }
 * // [data-ui="Button"][data-ui-size="large"] { ... }
 * ```
 *
 * @template TProps - The type of props that can be converted to data attributes
 *
 * @param props - Configuration object
 * @param props.ui - Base component identifier, becomes the `data-ui` attribute value
 * @param props.attrs - Array of prop keys from `TProps` that should be converted to `data-ui-*` attributes.
 *                      These props are transformed from camelCase to kebab-case (e.g., `zIndex` → `data-ui-z-index`).
 *                      Only props listed here are converted; other props are passed through unchanged.
 * @param props.className - Optional additional CSS classes to merge with the base `ui` class
 * @param props.rest - Additional props. Props matching keys in `attrs` are converted to data attributes;
 *                     all other props are passed through to the returned object.
 *
 * @returns An object containing:
 *   - `data-ui`: The base component identifier
 *   - `data-ui-{kebab-case-key}`: For each prop in `attrs` that was provided, converted to kebab-case
 *   - `className`: Merged class name combining the base `ui` class with any provided `className`
 *   - All other props that were not listed in `attrs`
 *
 * @remarks
 * - Props in `attrs` are converted to kebab-case automatically (e.g., `zIndex` → `z-index`)
 * - The returned object is designed to be spread onto DOM elements for CSS attribute selectors
 * - This establishes a type-safe contract: TypeScript ensures only valid props can be in `attrs`,
 *   and CSS can reliably target these variants using `[data-ui-*]` selectors
 */
export const ui = <const TProps>({
	ui,
	attrs,
	className,
	...rest
}: ui.Props<TProps>): ui.Result<TProps> => {
	const data: [
		string,
		unknown,
	][] = [];
	const props: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(rest)) {
		if (attrs.includes(key as keyof TProps)) {
			data.push([
				`data-ui-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
				value,
			]);
			continue;
		}

		props[key] = value;
	}

	return {
		"data-ui": ui,
		...(Object.fromEntries(data) as ui.Data<TProps, keyof TProps>),
		...props,
		className: tvc(ui, className),
	};
};
