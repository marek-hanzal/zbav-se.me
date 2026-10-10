import { Effect } from "effect";
import { translatorFn } from "~/translation/fn/translatorFn";
import { translationsFx } from "~/translation/fx/translationsFx";
import type { LocaleSchema } from "~/translation/schema/LocaleSchema";

export namespace withTranslatorFx {
	export interface Props extends LocaleSchema.Type {
		//
	}
}

export const withTranslatorFx = Effect.fn("withTranslatorFx")(function* ({
	locale,
}: withTranslatorFx.Props) {
	return translatorFn({
		translations: yield* translationsFx({
			locale,
		}),
	});
});
