import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { testabase as coolTestabase } from "@use-pico/server/testabase";
import { Effect } from "effect";
import { onTestFinished } from "vitest";
import type { Database } from "~/server/database/Database";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: withDatabaseFx<Database>({}).pipe(
			Effect.provideService(MigrationContextFx, {}),
		),
		name,
		onTestFinished,
	});
};
