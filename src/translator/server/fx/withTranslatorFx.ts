import { Effect } from "effect";
import { translationsFx } from "~/common/translation/server/fx/translationsFx";
import type { LocaleSchema } from "~/common/translation/server/schema/LocaleSchema";
import { translator } from "~/translation/fn/translator";

export namespace withTranslatorFx {
	export interface Props extends LocaleSchema.Type {
		//
	}
}

export const withTranslatorFx = Effect.fn("withTranslatorFx")(function* ({
	locale,
}: withTranslatorFx.Props) {
	return translator({
		translations: yield* translationsFx({
			locale,
		}),
	});
});
