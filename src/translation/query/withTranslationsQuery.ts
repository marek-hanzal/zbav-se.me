import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { translationsFn } from "~/translation/fn/translationsFn";
import type { LocaleSchema } from "~/translation/schema/LocaleSchema";

export const withTranslationsQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withTranslationsQuery",
	]),
	errors: {} as {
		query: translationsFn.Error;
	},
	keysFn(data: LocaleSchema.Type) {
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
