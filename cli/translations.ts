import { locales } from "~/locales";
import { TranslationSources } from "~/translation/constant/TranslationSources";
import { txFn } from "~/translation-tooling/fn/txFn";

txFn({
	packages: [
		`${import.meta.dirname}/..`,
	],
	output: `${import.meta.dirname}/../src/database-migration/data`,
	locales,
	sources: TranslationSources,
});
