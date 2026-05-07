import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { translationsFn } from "../fn/translationsFn";
import type { LocaleSchema } from "../server/schema/LocaleSchema";

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
