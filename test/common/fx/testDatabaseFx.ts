import { Effect } from "effect";
import { runAuthMigrationFn } from "~/authentication/fn/runAuthMigrationFn";
import { imports } from "~/database/constant/imports";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import type { Database } from "~/database/type/Database";
import { migrations } from "~/database-migration/constant/migrations";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { translationSyncNodeFx } from "./translationSyncNodeFx";

export const testDatabaseFx = withDatabaseFx<Database>({
	logger: getRootLoggerFn([
		"db",
	]),
	async onPreMigrationFn({ dialect }) {
		await runAuthMigrationFn(dialect);
	},
	async onPostMigrationFn(instance) {
		await translationSyncNodeFx().pipe(withKyselyFn(instance), Effect.runPromise);
	},
	imports,
}).pipe(Effect.provideService(MigrationContextFx, migrations));
