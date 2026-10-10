import type { Database } from "~/database/type/Database";
import { withMigrationFn } from "~/database-query/fn/withMigrationFn";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { testabaseFn as coolTestabaseFn } from "~/test-database/fn/testabaseFn";

export namespace testabaseFn {
	export interface Props
		extends Pick<coolTestabaseFn.Props<Database>, "name" | "onTestFinishedFn"> {
		//
	}
}

export const testabaseFn = (props: testabaseFn.Props) => {
	return coolTestabaseFn({
		dsn: ServerDatabaseSchema.parse(process.env).SERVER_DATABASE_URL,
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLoggerFn([
				"db",
			]),
		}).pipe(withMigrationFn({})),
		template: "e2e",
		...props,
	});
};
