import type { TranslationListSchema } from "../schema/TranslationListSchema";
import type { TranslationSchema } from "../schema/TranslationSchema";
import { keyOf } from "./keyOf";

export namespace translator {
	export interface Value {
		text: string;
		type: "hash" | "text" | "fallback" | "key";
	}

	export interface Translator {
		index: Map<string, TranslationSchema.Type>;
		push(translations: TranslationListSchema.Type): void;
		value(key: string, fallback?: string): Value;
		text(key: string, fallback?: string): string;
	}
}

export const translator: translator.Translator = {
	index: new Map<string, TranslationSchema.Type>(),
	push(translations) {
		Object.entries(translations).forEach(([key, value]) => {
			this.index.set(key, value);
		});
	},
	value(key, fallback) {
		let text: string | undefined;

		if ((text = this.index.get(keyOf(key))?.value)) {
			return {
				text,
				type: "hash",
			};
		}

		if ((text = this.index.get(key)?.value)) {
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
