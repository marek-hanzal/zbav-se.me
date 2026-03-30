import { Effect } from "effect";
import { onTestFinished } from "vitest";
import { MigrationContextFx, withDatabaseFx } from "@/lib/common/database";
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
