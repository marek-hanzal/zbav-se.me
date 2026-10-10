import { locales } from "~/locales";
import { TranslationSources } from "~/translation/constant/TranslationSources";
import { tx } from "~/translation-tooling/fn/tx";

tx({
	packages: [
		`${import.meta.dirname}/..`,
	],
	output: `${import.meta.dirname}/../src/database-migration/data`,
	locales,
	sources: TranslationSources,
});
