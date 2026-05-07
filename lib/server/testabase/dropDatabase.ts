import type { Effect } from "effect";
import { sql } from "kysely";
import type { DialectContextFx, withDatabaseFx } from "@/lib/common/database";
import { withAdminDatabase } from "./withAdminDatabase";

export namespace dropDatabase {
	export interface Props<TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		dsn: string;
		name: string;
		root: string;
	}
}

export const dropDatabase = async <TDatabase>({
	databaseFx,
	dsn,
	name,
	root,
}: dropDatabase.Props<TDatabase>) => {
	const { kysely } = await withAdminDatabase({
		databaseFx,
		dsn,
		name: `drop:${name}`,
		root,
	});

	try {
		await sql`DROP DATABASE IF EXISTS ${sql.ref(name)} WITH (FORCE)`.execute(kysely);
	} finally {
		await kysely.destroy();
	}
};
