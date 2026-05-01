import { Effect } from "effect";
import { onTestFinished } from "vitest";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
import { testabase as coolTestabase } from "@/lib/server/testabase";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { Database } from "~/server/database/Database";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLogger([
				"db",
			]),
		}).pipe(Effect.provideService(MigrationContextFx, {})),
		name,
		onTestFinished,
	});
};
