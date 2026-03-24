import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { testabase as coolTestabase } from "@use-pico/server/testabase";
import { Effect } from "effect";
import { onTestFinished } from "vitest";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: withDatabaseFx({}).pipe(Effect.provideService(MigrationContextFx, {})),
		name,
		onTestFinished,
	});
};
