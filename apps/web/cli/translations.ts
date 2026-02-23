import { TranslationSources } from "@use-pico/client/translation";
import { tx } from "@use-pico/server/tx";
import { locales } from "../src/locales";

tx({
	packages: [
		`${__dirname}/..`,
	],
	output: `${__dirname}/../src/translation`,
	locales,
	sources: TranslationSources,
});
