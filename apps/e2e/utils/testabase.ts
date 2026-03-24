import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { testabase as coolTestabase } from "@use-pico/server/testabase";
import type { Database } from "@zbav-se.me/server/database";
import { Effect } from "effect";

export const testabase = (name: string) => {
	return coolTestabase({
		/**
		 * We should have already ensure we've template database prepared, thus it's no longer
		 * needed to have migrations in the stack.
		 */
		databaseFx: withDatabaseFx<Database>({}).pipe(
			Effect.provideService(MigrationContextFx, {}),
		),
		template: "e2e",
		name,
		onTestFinished() {
			//
		},
	});
};
