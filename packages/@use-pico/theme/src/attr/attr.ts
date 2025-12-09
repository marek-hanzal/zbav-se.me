import { tvc } from "@use-pico/cls";

type KebabCase<S extends string> = S extends `${infer Head}${infer Tail}`
	? Tail extends Uncapitalize<Tail>
		? `${Lowercase<Head>}${KebabCase<Tail>}`
		: `${Lowercase<Head>}-${KebabCase<Uncapitalize<Tail>>}`
	: S;

type Attrs<TAttrs, T extends keyof TAttrs> = {
	[K in T as `data-${KebabCase<K & string>}`]?: TAttrs[K];
};

const toKey = (key: string) => {
	return `data-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
};

export namespace attr {
	export type Rest = object;

	export type Result<TAttrs> = Record<string, unknown> &
		Attrs<TAttrs, keyof TAttrs> & {
			"data-ui": string;
			className?: string;
		};

	export type Component<TAttrs, TRest extends Rest> = Omit<TRest, "className"> &
		Partial<TAttrs> & {
			className?: tvc.ClassName;
		};

	export type Props<TAttrs> = Partial<TAttrs> & {
		ui: string;
		attrs: readonly (keyof TAttrs)[];
		className?: tvc.ClassName;
	} & Record<string, unknown>;
}

export const attr = <const TAttrs>({
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
		...(Object.fromEntries(data) as Attrs<TAttrs, keyof TAttrs>),
		...props,
		className: tvc(ui, className),
	};
};
