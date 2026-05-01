import { TranslationSources } from "@/lib/client/translation";
import { tx } from "@/lib/server/tx";
import { locales } from "~/locales";

tx({
	packages: [
		`${__dirname}/..`,
	],
	output: `${__dirname}/../src/server/@migrations/translation`,
	locales,
	sources: TranslationSources,
});
