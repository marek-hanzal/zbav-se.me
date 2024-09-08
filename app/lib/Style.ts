import type { ClassValue, VariantProps } from "tailwind-variants";

export namespace Style {
	export type Class = ClassValue;

	export type Css<T extends (...args: any[]) => any> = T extends { slots: infer S }
		? Partial<Record<keyof S, Class>>
		: never;

	export type Tva<T extends (...args: any[]) => any> = T extends (...args: infer U) => any
		? (props?: U[0]) => ReturnType<T>
		: never;
}

export type Style<T extends (...args: any[]) => any, P = unknown> = {
	variant?: VariantProps<T>;
	tva?: Style.Tva<T>;
	css?: Style.Css<T>;
} & Omit<P, "variant" | "tva" | "css">;
