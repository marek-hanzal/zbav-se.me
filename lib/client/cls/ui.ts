import { tvc } from "./tvc";

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
	export type Data<TProps, T extends keyof TProps> = Record<string, unknown> & {
		[K in T as `data-ui-${KebabCase<K & string>}`]?: TProps[K];
	};

	export type Result<TProps> = Data<TProps, keyof TProps> & {
		"data-ui": string;
		className?: string;
	};

	export type Component<TProps extends object, TRest extends object = object> = Data<
		TProps,
		keyof TProps
	> &
		Omit<TRest, "className"> & {
			/**
			 * Optional class names, uses tailwind merge under the hood.
			 */
			className?: tvc.ClassName;
		};

	/**
	 * Internal props used for "ui" method; this should not be used outside
	 *
	 * @template TProps - The type of props that can be converted to data attributes
	 */
	export interface Props<TProps extends object> {
		/**
		 * Base component identifier, becomes the `data-ui` attribute value
		 */
		name: string;
		ui: Data<TProps, keyof TProps>;
		/**
		 * Optional additional CSS classes to merge with the base `ui` class
		 */
		className: tvc.ClassName;
	}

	export type PropsEx<TProps extends object> = Omit<Props<TProps>, "name">;
}

export const ui = <const TProps extends object>({ name, className, ui }: ui.Props<TProps>) => {
	return {
		...ui,
		"data-ui": name,
		className: tvc(name, className),
	} satisfies ui.Result<TProps>;
};
