import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { onTestFinished } from "vitest";
import { testabase as coolTestabase } from "@/lib/server/testabase";
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
