import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { testabase as coolTestabase } from "@use-pico/server/testabase";
import type { Database } from "@zbav-se.me/server/database";
import { Effect } from "effect";

export const testabase = (name: string) => {
	return coolTestabase({
		databaseFx: withDatabaseFx<Database>({}).pipe(
			Effect.provideService(MigrationContextFx, {}),
		),
		name,
		onTestFinished(callbackFn) {
			//
		},
	});
};
