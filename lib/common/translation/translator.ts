import type { TranslationSchema } from "../schema/TranslationSchema";
import { keyOf } from "./keyOf";

export namespace translator {
	export interface Value {
		text: string;
		type: "hash" | "text" | "fallback" | "key";
	}

	export interface Translator {
		value(key: string, fallback?: string): Value;
		text(key: string, fallback?: string): string;
	}

	export interface Props {
		translations: TranslationSchema.Type[];
	}
}

export const translator = ({ translations }: translator.Props): translator.Translator => {
	const index = new Map(
		translations.map((item) => [
			item.key,
			item,
		]),
	);

	return {
		value(key, fallback) {
			let text: string | undefined;

			if ((text = index.get(keyOf(key))?.value)) {
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
		text(key, fallback) {
			return this.value(key, fallback).text;
		},
	};
};
