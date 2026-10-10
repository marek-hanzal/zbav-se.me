import { keyOfFn } from "~/translation/fn/keyOfFn";
import type { TranslationSchema } from "~/translation/schema/TranslationSchema";

export namespace translatorFn {
	export interface Value {
		text: string;
		type: "hash" | "text" | "fallback" | "key";
	}

	export interface Translator {
		listFn(): TranslationSchema.Type[];
		valueFn(key: string, fallback?: string): Value;
		textFn(key: string, fallback?: string): string;
	}

	export interface Props {
		translations: TranslationSchema.Type[];
	}
}

export const translatorFn = ({ translations }: translatorFn.Props): translatorFn.Translator => {
	const index = new Map(
		translations.map((item) => [
			item.key,
			item,
		]),
	);

	return {
		listFn() {
			return Array.from(index.values());
		},
		valueFn(key, fallback) {
			let text: string | undefined;

			if ((text = index.get(keyOfFn(key))?.value)) {
				return {
					text,
					type: "hash",
				};
			}

			if ((text = index.get(key)?.value)) {
				return {
					text,
					type: "text",
				};
			}

			if ((text = fallback)) {
				console.warn(`translator: fallback for [${key}] > [${fallback}]`);
				return {
					text,
					type: "fallback",
				};
			}

			return {
				text: key,
				type: "key",
			};
		},
		textFn(key, fallback) {
			return this.valueFn(key, fallback).text;
		},
	};
};
