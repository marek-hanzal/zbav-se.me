import { Effect } from "effect";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import { migrations } from "~/server/@migrations/migrations";
import { runAuthMigration } from "~/server/auth/runAuthMigration";
import type { Database } from "~/server/database/Database";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
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
}).pipe(Effect.provideService(MigrationContextFx, migrations));
