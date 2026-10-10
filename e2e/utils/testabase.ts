import type { Database } from "~/database/type/Database";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withMigrationFx } from "~/database-query/fx/withMigrationFx";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
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
