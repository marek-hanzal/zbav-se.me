import { Effect } from "effect";
import { runAuthMigration } from "~/authentication/fn/runAuthMigration";
import { imports } from "~/database/constant/imports";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import type { Database } from "~/database/type/Database";
import { migrations } from "~/database-migration/constant/migrations";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { translationSyncNodeFx } from "./translationSyncNodeFx";

export const testDatabaseFx = withDatabaseFx<Database>({
	logger: getRootLogger([
		"db",
	]),
	async onPreMigration({ dialect }) {
		await runAuthMigration(dialect);
	},
	async onPostMigration(instance) {
		await translationSyncNodeFx().pipe(withKyselyFx(instance), Effect.runPromise);
	},
	imports,
}).pipe(Effect.provideService(MigrationContextFx, migrations));
