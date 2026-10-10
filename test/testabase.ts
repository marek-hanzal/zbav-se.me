import { Effect } from "effect";
import { onTestFinished } from "vitest";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import type { Database } from "~/server/database/Database";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { testabase as coolTestabase } from "~/test-database/fn/testabase";

export const testabase = (name: string) => {
	return coolTestabase({
		dsn: ServerDatabaseSchema.parse(process.env).SERVER_DATABASE_URL,
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLogger([
				"db",
			]),
		}).pipe(Effect.provideService(MigrationContextFx, {})),
		name,
		onTestFinished,
	});
};
