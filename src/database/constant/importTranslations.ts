import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { translationSyncFx } from "~/translation/fx/translationSyncFx";

export const importTranslations: withDatabaseFx.Import<Database> = {
	name: "translations",
	async run(instance) {
		return translationSyncFx().pipe(withKyselyFx(instance), Effect.runPromise);
	},
} as const;
