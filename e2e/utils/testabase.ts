import { getRootLogger } from "~/common/log/getRootLogger";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withMigrationFx } from "~/database-query/fx/withMigrationFx";
import type { Database } from "~/server/database/Database";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { testabase as coolTestabase } from "~/test-database/fn/testabase";

export namespace testabase {
	export interface Props extends Pick<coolTestabase.Props<Database>, "name" | "onTestFinished"> {
		//
	}
}

export const testabase = (props: testabase.Props) => {
	return coolTestabase({
		dsn: ServerDatabaseSchema.parse(process.env).SERVER_DATABASE_URL,
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLogger([
				"db",
			]),
		}).pipe(withMigrationFx({})),
		template: "e2e",
		...props,
	});
};
