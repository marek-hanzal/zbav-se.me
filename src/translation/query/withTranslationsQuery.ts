import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { translationsFn } from "~/translation/fn/translationsFn";
import type { LocaleSchema } from "~/translation/schema/LocaleSchema";

export const withTranslationsQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withTranslationsQuery",
	]),
	errors: {} as {
		query: translationsFn.Error;
	},
	keys(data: LocaleSchema.Type) {
		return [
			"translations",
			data,
		];
	},
	async queryFn(data: LocaleSchema.Type) {
		return translationsFn({
			data,
		});
	},
});
