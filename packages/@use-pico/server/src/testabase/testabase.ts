import {
	type DialectContextFx,
	type withDatabaseFx,
	withDialectFx,
} from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

export namespace testabase {
	export interface Props<in out TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		/**
		 * Root (admin) database name
		 */
		root?: string;
		template?: string;
		name?: string;
		onTestFinished(callbackFn: () => Promise<any>): void;
	}
}

export const testabase = async <const TDatabase>({
	databaseFx,
	root = "postgres",
	template = "test",
	name = genId(),
	onTestFinished,
}: testabase.Props<TDatabase>) => {
	return Effect.gen(function* () {
		const { kysely } = yield* databaseFx.pipe(
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/${root}`,
						max: 1,
					}),
				}),
			),
		);

		yield* Effect.promise(async () => {
			await sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely);

			await sql`CREATE DATABASE ${sql.ref(name)} TEMPLATE ${sql.ref(template)}`.execute(
				kysely,
			);

			await kysely.destroy();
		});

		const instance = yield* databaseFx.pipe(
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: `${process.env.SERVER_DATABASE_URL}/${name}`,
						max: 4,
					}),
				}),
			),
		);

		onTestFinished(async () => {
			await instance.kysely.destroy();
		});

		return instance;
	}).pipe(Effect.runPromise);
};
