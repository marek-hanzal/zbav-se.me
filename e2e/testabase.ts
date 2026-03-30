import { withDatabaseFx, withMigrationFx } from "@/lib/common/database";
import { testabase as coolTestabase } from "@/lib/server/testabase";
import type { Database } from "~/server/database/Database";

export const testabase = (name: string) => {
	return coolTestabase({
		/**
		 * We should have already ensure we've template database prepared, thus it's no longer
		 * needed to have migrations in the stack.
		 */
		databaseFx: withDatabaseFx<Database>({}).pipe(withMigrationFx({})),
		template: "e2e",
		name,
		onTestFinished() {
			//
		},
	});
};
