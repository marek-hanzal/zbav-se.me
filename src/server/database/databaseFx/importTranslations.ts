import { Effect } from "effect";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { Database } from "../Database";
import { withKyselyFx } from "../fx/withKyselyFx";

export const importTranslations: withDatabaseFx.Import<Database> = {
	name: "translations",
	async run(instance) {
		return translationSyncFx().pipe(withKyselyFx(instance), Effect.runPromise);
	},
} as const;
