import { DialectContextFx, type withDatabaseFx } from "@use-pico/common/database";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Client, Pool } from "pg";

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
		const client = new Client({
			connectionString: `${process.env.SERVER_DATABASE_URL}/${root}`,
			connectionTimeoutMillis: 250,
		});

		yield* Effect.promise(async () => {
			await client.query(`DROP DATABASE IF EXISTS $1`, [
				name,
			]);

			await client.query(`CREATE DATABASE $1 TEMPLATE $2`, [
				name,
				template,
			]);

			await client.end();
		});

		const instance = yield* databaseFx.pipe(
			Effect.provideService(
				DialectContextFx,
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
