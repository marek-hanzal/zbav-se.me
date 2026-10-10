import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { translationSyncFx } from "~/translation/fx/translationSyncFx";

export const importTranslations: withDatabaseFx.Import<Database> = {
	name: "translations",
	async runFn(instance) {
		return translationSyncFx().pipe(withKyselyFn(instance), Effect.runPromise);
	},
} as const;
