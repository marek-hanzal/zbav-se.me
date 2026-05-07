import { withDatabaseFx, withMigrationFx } from "@/lib/common/database";
import { testabase as coolTestabase } from "@/lib/server/testabase";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { Database } from "~/server/database/Database";

export namespace testabase {
	export interface Props extends Pick<coolTestabase.Props<Database>, "name" | "onTestFinished"> {
		//
	}
}

export const testabase = (props: testabase.Props) => {
	return coolTestabase({
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLogger([
				"db",
			]),
		}).pipe(withMigrationFx({})),
		template: "e2e",
		...props,
	});
};
