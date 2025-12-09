import { tvc } from "@use-pico/cls";

type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Tail extends Uncapitalize<Tail>
		? `${Lowercase<Head>}${KebabCase<Tail>}`
		: `${Lowercase<Head>}-${KebabCase<Uncapitalize<Tail>>}`
	: S;

type Attrs<TAttrs extends attr.Attributes, T extends keyof TAttrs> = {
	[K in T as `data-${KebabCase<K & string>}`]?: TAttrs[K];
};

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
		| "subtle"
		| "medium"
		| "strong";

	export interface Attributes {
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

	export type DataAttributes<TAttrs extends Attributes> = Attrs<TAttrs, keyof TAttrs>;

	/**
	 * Výstup z attr():
	 * - "data-ui"
	 * - data-xxx pouze pro keyof TAttrs
	 * - zbytek props (Record<string, unknown>)
	 */
	export type Result<TAttrs extends Attributes> = Record<string, unknown> &
		DataAttributes<TAttrs> & {
			"data-ui": string;
			className?: string;
		};

	/**
	 * Public typ pro komponenty
	 * - TRest = DOM props (button/div/anchor...)
	 * - TAttrs = subset Attributes, které komponenta podporuje
	 */
	export type Component<TAttrs extends Attributes, TRest extends Rest> = Omit<
		TRest,
		"className"
	> &
		Partial<TAttrs> & {
			className?: tvc.ClassName;
		};

	/**
	 * Input pro attr():
	 * - ui, attrs, className
	 * - libovolné další props (DOM stuff)
	 * - subset Attributes (TAttrs)
	 */
	export type Props<TAttrs extends Attributes> = Partial<TAttrs> & {
		ui: string;
		attrs: readonly (keyof TAttrs)[];
		className?: tvc.ClassName;
	} & Record<string, unknown>;
}

export const attr = <TAttrs extends attr.Attributes>({
	ui,
	attrs,
	className,
	...rest
}: attr.Props<TAttrs>): attr.Result<TAttrs> => {
	const data: [
		string,
		unknown,
	][] = [];
	const props: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(rest)) {
		if (attrs.includes(key as keyof TAttrs)) {
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
		...(Object.fromEntries(data) as attr.DataAttributes<TAttrs>),
		...props,
		className: tvc(ui, className),
	};
};
