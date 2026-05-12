import { Effect } from "effect";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import { withKyselyFx } from "./fx/withKyselyFx";

/**
 * Don't destructure stuff as there is Proxy
 */
export const databaseFx = withDatabaseFx<Database>({
	logger: getRootLogger([
		"db",
	]),
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
	imports: [
		{
			name: "translations",
			async run(instance) {
				return translationSyncFx().pipe(withKyselyFx(instance), Effect.runPromise);
			},
		},
	],
}).pipe(Effect.provideService(MigrationContextFx, migrations));
