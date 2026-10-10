import { TranslationSources } from "@/lib/client/translation";
import { tx } from "@/lib/server/tx";
import { locales } from "~/locales";

tx({
	packages: [
		`${import.meta.dirname}/..`,
	],
	output: `${import.meta.dirname}/../src/server/@migrations/translation`,
	locales,
	sources: TranslationSources,
});
