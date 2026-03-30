import { tx } from "@use-pico/server/tx";
import { TranslationSources } from "@/lib/client/translation";
import { locales } from "~/locales";

tx({
	packages: [
		`${__dirname}/..`,
	],
	output: `${__dirname}/../src/translation`,
	locales,
	sources: TranslationSources,
});
