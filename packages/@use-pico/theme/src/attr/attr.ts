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

	export interface Attributes {
		tone?: Tone;
		theme?: Theme;
		//
		size?: Size;
		round?: Round;
		justify?: Justify;
		items?: Items;
		square?: Square;
		inner?: Inner;
		snapTo?: SnapTo;
		gap?: Gap;
		flow?: Flow;
		position?: Position;
		height?: Height;
		width?: Width;
		//
		background?: boolean;
		border?: boolean;
		disabled?: boolean;
		shadow?: boolean;
		zIndex?: boolean;
	}

	export type Props<TPick extends keyof Attributes> = Pick<Attributes, TPick> & {
		ui: string;
		className?: tvc.ClassName;
	};

	export type PropsEx<TPick extends keyof Attributes, TProps = unknown> = Omit<
		TProps,
		"className"
	> &
		Omit<Props<TPick>, "ui">;
}

export const attr = <TPick extends keyof attr.Attributes>({
	ui,
	className,
	...props
}: attr.Props<TPick>) => {
	const attrs = Object.fromEntries(
		Object.entries(props).map(([key, value]) => [
			toKey(key),
			value,
		]),
	) as Attrs<TPick>;

	return {
		"data-ui": ui,
		//
		...attrs,
		//
		className: tvc(ui, className),
	} as const;
};
